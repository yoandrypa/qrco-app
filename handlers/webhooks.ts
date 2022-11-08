
import Stripe from 'stripe'
import {update as updateUserInDB, deleteUserSubscription} from '../handlers/users'
import { findByCustomerId as findUserByCustomerId } from '../handlers/users';
import {PLAN_LIVE_MODE_PRICES,PLAN_TEST_MODE_PRICES} from '../consts'

function buildUserSubscription(
  subscription: Stripe.Subscription
): UserSubscription {
  const lineItem = subscription.items.data[0];
  const price = lineItem.price;

  return {
    id: subscription.id,
    priceId: price?.id,
    status : subscription.status,
    currency: lineItem.price.currency ?? null,
    interval: price?.recurring?.interval ?? null,
    intervalCount: price?.recurring?.interval_count ?? null,
    createdDate: subscription.created,
    periodStartsAt: subscription.current_period_start,
    periodEndsAt: subscription.current_period_end
  };
}

/**
 * Set subscription data into de DB
 * @param customerId 
 * @param subscription 
 */
async function setUserSubscription(
    customerId: string,
    subscription: UserSubscription,
  ) {

   const {id} = await findUserByCustomerId(customerId) 
   console.error(`the id is ${id} customer ${customerId}`)
    if(!id){
      return Error(`Could not find user for customerId ${customerId}`);
    }   
  try {
    let plan: string;
    switch (subscription.priceId) {
      case PLAN_LIVE_MODE_PRICES.basic || PLAN_TEST_MODE_PRICES.basic:
        plan = 'basic'
        break;
      case PLAN_LIVE_MODE_PRICES.basicAnnual || PLAN_TEST_MODE_PRICES.basicAnnual:
        plan = 'basicAnnual'
        break;
      case PLAN_LIVE_MODE_PRICES.business || PLAN_TEST_MODE_PRICES.business:
        plan = 'business'
        break;
      case PLAN_LIVE_MODE_PRICES.businessAnnual || PLAN_TEST_MODE_PRICES.businessAnnual:
        plan = 'businessAnnual'
        break;
      case PLAN_LIVE_MODE_PRICES.premium || PLAN_TEST_MODE_PRICES.premium:
        plan = 'premium'
        break;
      case PLAN_LIVE_MODE_PRICES.premiumAnnual || PLAN_TEST_MODE_PRICES.premiumAnnual:
        plan = 'premiumAnnual'
        break;    
      default:
        plan = ''
        break;
    }

   await updateUserInDB({id: id},{subscriptionData: subscription, planType: plan})      
  } catch (error) {
    console.log(`Error saving user subscription data`, error)
    return error
  }
}

export async function onDeleteSubscription(customerId: string){
  try {
    await deleteUserSubscription({customerId: customerId})
  } catch (error) {
    console.error('Error deleting user subscription data')
    return error
  }

}

export async function onCheckoutCompleted(
    session: Stripe.Checkout.Session,
    subscription: Stripe.Subscription
  ) {
    const customerId = subscription.customer.toString();    
    // status can either be paid ,unpaid or no_payment_required
    const status = subscription.status;
  
    const subscriptionData 
      = buildUserSubscription(subscription);    
    // use your DB methods to 
    // set user.subscription=subscriptionData  
    return await setUserSubscription(
      customerId,
      subscriptionData,
    );
  }

export async function onSubscriptionUpdated(subscription: Stripe.Subscription){
 const customerId = subscription.customer.toString() 
  const subscriptionData 
  = buildUserSubscription(subscription); 
  return await setUserSubscription(
    customerId,
    subscriptionData,
  );
}  



