import { z } from "zod";
import { createAxios } from "~/server/utils";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const instrumentsRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = await createAxios().get(
          `https://web.api.six-group.com/api/findata/v1/searchInstruments?query=${input.query}`
        );
        const parsedData: object[] = [];
        response.data.data.searchInstruments.forEach((e: any) => {
          parsedData.push({
            display: e.hit.name,
            identifier:
              e.hit.mostLiquidListing.ticker + "_" + e.hit.mostLiquidMarket.bc,
          });
        });
        return parsedData;
      } catch (e) {
        return [];
      }
    }),
  graph_data: publicProcedure
    .input(z.object({ query: z.array(z.string()), from: z.string(), to: z.string() }))
    .query(async ({ input }) => {
      const ax = createAxios();
      const values = {};
      const displays = {}

      for (const id of input.query) {
        try {
          const response = await ax.get(
            `https://web.api.six-group.com/api/findata/v1/listings/marketData/eodTimeseries?scheme=TICKER_BC&ids=${id}&from=${input.from}&to=${input.to}`
          );
          if (response.data.code == "invalid_type") {
            continue;
          }
          const parsedData: object[] = [];
          response.data.data.listings[0].marketData.eodTimeseries.forEach((e: any) => {
            if (!e.close) {
              return;
            }
    
            const time = new Date(e.sessionDate).getTime();
            if (!(time in values))
              values[time] = {}
            values[time][id] = e.close;  
            parsedData.push({
              sessionDate: new Date(e.sessionDate).getTime(),
              value: e.close
            })
          });
          displays[id] = response.data.data.listings[0].lookup.listingName;
        } catch (e) {
        }
      }
      let temp = []
      for (const t in values) {
        temp.push({
          time: t,
          ...values[t]
        })
      }
      temp = temp.sort((a, b) => a.time - b.time)
      return {
        values: temp,
        displays: displays
      };
    }),
});
