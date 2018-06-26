// @flow
import moment from "moment";
import { EPOCH_DATE, EPOCH_DATE_TIME } from "@grail/lib";

export const formatDate = (date: string | Date | moment$Moment) => {
	const formattedDate = date === "" || date === null ? EPOCH_DATE : date;
	return moment(formattedDate)
		.startOf("day")
		.toISOString();
};

export const formatDateTime = (dateTime: string | Date | moment$Moment) => {
	const formattedDateTime = dateTime === "" || dateTime === null ? EPOCH_DATE_TIME : dateTime;
	return moment(formattedDateTime).toISOString();
};
