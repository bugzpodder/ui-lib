//@flow
export class Warning extends Error {
	isWarning: boolean;

	constructor(message: string) {
		super(message);
		this.isWarning = true;
	}
}
