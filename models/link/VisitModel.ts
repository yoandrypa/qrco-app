import dynamoose from "../../libs/dynamoose";
import { LinkModel } from "./LinkModel";
import { getUuid } from "../../helpers/qr/helpers";

// instantiate a dynamoose schema
const VisitSchema = new dynamoose.Schema({
  userId: {
    type: String,
    hashKey: true
  },
  shortLinkId: { type: [LinkModel, Object] },
  continents: {
    type: Object
  },
  countries: {
    type: Object
  },
  cities: {
    type: Object
  },
  link_id: {
    type: LinkModel
  },
  referrers: {
    type: Object
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  br_chrome: {
    type: Number,
    required: true,
    default: 0
  },
  br_edge: {
    type: Number,
    required: true,
    default: 0
  },
  br_firefox: {
    type: Number,
    required: true,
    default: 0
  },
  br_ie: {
    type: Number,
    required: true,
    default: 0
  },
  br_opera: {
    type: Number,
    required: true,
    default: 0
  },
  br_other: {
    type: Number,
    required: true,
    default: 0
  },
  br_safari: {
    type: Number,
    required: true,
    default: 0
  },
  dv_mobile: {
    type: Number,
    required: true,
    default: 0
  },
  dv_tablet: {
    type: Number,
    required: true,
    default: 0
  },
  dv_smarttv: {
    type: Number,
    required: true,
    default: 0
  },
  dv_desktop: {
    type: Number,
    required: true,
    default: 0
  },
  os_android: {
    type: Number,
    required: true,
    default: 0
  },
  os_ios: {
    type: Number,
    required: true,
    default: 0
  },
  os_linux: {
    type: Number,
    required: true,
    default: 0
  },
  os_macos: {
    type: Number,
    required: true,
    default: 0
  },
  os_other: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    rangeKey: true
  }
}, {
  "timestamps": {
    createdAt: undefined,
    updatedAt: "updatedAt"
  }
});

// create a model from schema and export it
export const VisitModel = dynamoose.model("visits", VisitSchema);
