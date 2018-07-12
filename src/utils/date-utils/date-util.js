// @flow
import moment from "moment";
import { DATE_FORMAT, EPOCH_DATE, EPOCH_DATE_TIME } from "@grail/lib";

export const formatDateOnly = (date: string | Date | moment$Moment) => {
	if (date === null) {
		return null;
	}
	const formattedDate = date === "" ? EPOCH_DATE : date;
	return moment(formattedDate).format(DATE_FORMAT);
};

// Formats a date field to start of date, with time. This is problematic, since
// it inserts timezone specific properties into a date only field.
// TODO(nsawas): deprecate formatDate below.
// To do so, convert database table field to `DATE` type, etc.
export const formatDate = (date: string | Date | moment$Moment) => {
	if (date === null) {
		return null;
	}
	const formattedDate = date === "" ? EPOCH_DATE : date;
	return moment(formattedDate)
		.startOf("day")
		.toISOString();
};

export const formatDateTime = (dateTime: string | Date | moment$Moment) => {
	if (dateTime === null) {
		return null;
	}
	const formattedDateTime = dateTime === "" ? EPOCH_DATE_TIME : dateTime;
	return moment(formattedDateTime).toISOString();
};
