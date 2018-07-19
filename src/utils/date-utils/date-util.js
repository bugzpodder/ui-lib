// @flow
import moment from "moment";
import { DATE_FORMAT, EPOCH_DATE, EPOCH_DATE_TIME } from "@grail/lib";

export const formatDate = (date: string | Date | moment$Moment) => {
	if (date === null) {
		return null;
	}
	const formattedDate = date === "" ? EPOCH_DATE : date;
	return moment(formattedDate).format(DATE_FORMAT);
};

export const formatDateTime = (dateTime: string | Date | moment$Moment) => {
	if (dateTime === null) {
		return null;
	}
	const formattedDateTime = dateTime === "" ? EPOCH_DATE_TIME : dateTime;
	return moment(formattedDateTime).toISOString();
};
