import Schema from '../commons/schema';

import PendingUpdateSchema from './pending_update';
import AutomaticTaxSchema from './automatic_tax';
import PauseCollectionSchema from './pause_collection';
import BillingThresholdsSchema from './billing_thresholds';
import PendingInvoiceItemIntervalSchema from '../commons/interval';
import PaymentSettingsSchema from './payment_settings';
import TransferDataSchema from './transfer_data';
import ItemSchema from './item';
import IdentifierSchema from '../commons/identifier';
import CurrencySchema from '../commons/currency';
import DiscountSchema from '../commons/discount';

const schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    cancel_at_period_end: {
      type: Boolean,
    },
    currency: CurrencySchema,
    current_period_end: {
      type: Number,
    },
    current_period_start: {
      type: Number,
    },
    customer: {
      type: String,
      required: true,
    },
    default_payment_method: {
      type: String,
    },
    description: {
      type: String,
    },
    latest_invoice: {
      type: String,
    },
    pending_setup_intent: {
      type: String,
    },
    pending_update: {
      type: Object,
      schema: PendingUpdateSchema,
    },
    status: {
      type: String,
      enum: ['incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid'],
      index: {
        name: "subscriptionStatusIndex"
      }
    },
    application: {
      type: String,
    },
    application_fee_percent: {
      type: Number,
      min: 0,
      max: 100,
    },
    automatic_tax: {
      type: Object,
      schema: AutomaticTaxSchema,
    },
    billing_cycle_anchor: {
      type: Number,
    },
    billing_thresholds: {
      type: Object,
      schema: BillingThresholdsSchema,
    },
    cancel_at: {
      type: Number,
    },
    canceled_at: {
      type: Number,
    },
    collection_method: {
      type: String,
      enum: ['charge_automatically', 'send_invoice'],
    },
    created: {
      type: Number,
    },
    days_until_due: {
      type: Number,
    },
    default_source: {
      type: String,
    },
    discount: {
      type: Object,
      schema: DiscountSchema,
    },
    ended_at: {
      type: Number,
    },
    livemode: {
      type: Boolean,
    },
    next_pending_invoice_item_invoice: {
      type: Number,
    },
    pause_collection: {
      type: Object,
      schema: PauseCollectionSchema,
      default: {},
    },
    pending_invoice_item_interval: {
      type: Object,
      schema: PendingInvoiceItemIntervalSchema,
    },
    schedule: {
      type: String,
    },
    start_date: {
      type: Number,
    },
    test_clock: {
      type: String,
    },
    transfer_data: {
      type: Object,
      schema: TransferDataSchema,
    },
    trial_end: {
      type: Number,
    },
    trial_start: {
      type: Number,
    },
    metadata: {
      type: Object,
    },
    default_tax_rates: {
      type: Array,
      schema: [IdentifierSchema],
      default: [],
    },
    items: {
      type: Array,
      schema: [ItemSchema],
    },
    plan: {
      type: Object,
      schema: IdentifierSchema,
    },
    payment_settings: {
      type: Object,
      schema: PaymentSettingsSchema,
    },
    cognito_user_id: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    saveUnknown: [
      'metadata.**'
    ],
  },
);

export default schema;
