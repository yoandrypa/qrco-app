import React from "react";
import * as systemIcons from "./system"
import { underscore, humanize } from "inflection"
import { ShoppingBag1 as DefaultIcon } from "./system";

interface PropsType {
  iconId: string;
}

function getUserIconIds() {
  // TODO: Load users icons ids from db or s3;
  return [];
}

export function iconIds() {
  const sIconIds = Object.keys(systemIcons);
  const uIconIds = getUserIconIds();

  return [...sIconIds, ...uIconIds];
}

export function iconName(id: string) {
  return humanize(underscore(id.replace(/([^\d])(\d+)/, '$1_$2')));
}

export default function EbxIcon({ iconId }: PropsType) {
  // @ts-ignore
  const Icon = systemIcons[iconId];

  if (Icon) return <Icon fontSize="small" color='primary' />

  // TODO: Load and render user icon;

  return <DefaultIcon fontSize="small" />;
}
