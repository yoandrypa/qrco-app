interface ICountByUserResponseType {
  count: number;
}

export type TCountByUser = (userId: string, preGenerated?: boolean) => Promise<ICountByUserResponseType>;
export type TFetchByUser = (userId: string, limit: number, pageKey: string | null) => Promise<any>;
