import React, { PureComponent } from "react";
import Moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "~/utils/api";

const randomColor = (id : any): string => {
  if (id == "0")
    return "#dc2626"
  let result = '';
  for (let i = 0; i < 6; ++i) {
    const value = Math.floor(16 * Math.random());
    result += value.toString(16);
  }
  return '#' + result;
};

export default function LinearChart(props: any) {
  const { data, isLoading, refetch } = api.instruments.graph_data.useQuery(
    {
      query: props.query,
      from: props.from,
      to: props.to,
    });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data != null ? data.values : null} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickFormatter={(d) => Moment(parseInt(d)).format("YYYY-MM-DD")}/>
        <YAxis />
        <Tooltip labelFormatter={(d) => Moment(parseInt(d)).format("YYYY-MM-DD")}/>
        <Legend />
        {
          data != null && data.displays != null != null ?
            Object.keys(data.displays).map(id => {
              return <Line type="monotone" dataKey={id} stroke={randomColor(id)} name={data.displays[id]}/>
            }) : ""
        }
      </LineChart>
    </ResponsiveContainer>
  );
}
