export { checkAuthorization } from '../../../libs/gateways/aws/auth'
export { withSessionRoute } from '../../../libs/withSession'

export const isProductionMode = process.env.APP_ENV === 'production';


