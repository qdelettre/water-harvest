export interface Response {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: DailyUnits;
  daily: Daily;
}

export interface Daily {
  time: Date[];
  precipitation_sum: Array<number | null>;
}

export interface DailyUnits {
  time: string;
  precipitation_sum: string;
}

export enum Type {
  LastYearAvg = "last_year_avg",
}

export interface Query {
  lat: string;
  long: string;
  type: Type;
}

const baseURL = "https://archive-api.open-meteo.com/v1";

const fetchData = async (
  path: string,
  params: Record<string, string>,
): Promise<Response> => {
  const url = `${baseURL}/${path}?${new URLSearchParams(params)}`;
  const response = await fetch(decodeURI(url));

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json() as unknown as Response;
};

interface ParamsDerivedFromType {
  start_date: string;
  end_date: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDatesFromType = (_type: Type): ParamsDerivedFromType => {
  const currentDate = new Date();

  const formatter = (date: Date) => date.toISOString().split("T")[0];

  const lastYear = currentDate.getFullYear() - 1;
  return {
    start_date: formatter(new Date(lastYear, 0, 1)),
    end_date: formatter(new Date(lastYear, 11, 31)),
  };
};

export const getRainfall = ({ lat, long, type }: Query) => {
  const params = {
    latitude: lat,
    longitude: long,
    timezone: "GMT",
    daily: "precipitation_sum",
    ...getDatesFromType(type),
  };

  return fetchData("archive", params);
};
