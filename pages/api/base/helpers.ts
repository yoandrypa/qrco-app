export { checkAuthorization } from '../../../libs/gateways/aws/auth'
export { withSessionRoute } from '../../../libs/withSession'

export const IS_PRODUCTION = process.env.REACT_NODE_ENV === 'production';


