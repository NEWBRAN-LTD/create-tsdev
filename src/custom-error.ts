
export class CustomError extends Error {
	parent: Error

	constructor(parent: any) {
		super(parent.message)
		this.parent = parent
	}
}
