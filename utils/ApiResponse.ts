class ApiResponse {
  public success: boolean;

  constructor(
    public status: number,
    public message: string = "Success",
    public data: any = null
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.success = true;
  }
}

export { ApiResponse };
