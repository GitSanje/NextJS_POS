const responseStatus = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    408: "Request Timeout",
    410: "Gone",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  } as const;

  const reason = {
    REQUIRED: "The requested resource is required",
    NOT_AVAILABLE: "The requested resource is not available",
    EXPIRED: "The requested resource is expired",
  } as const;


type ResponseStatus = typeof responseStatus;

type ResponseCode = keyof ResponseStatus;

type ErrorType = keyof typeof reason;


type ResponseError = {
    success: false;
    error: {
      code: ResponseCode;
      type?: ErrorType;
      message: string;
    };
  };

export type ResponseWithMessage =
  | {
      success: true;
      code: ResponseCode;
      message: string;
    }
  | ResponseError;

  export type ResponseSuccess<T> =
  | {
      success: true;
      code: ResponseCode;
      message?: string;
      data: T;
    }
  | ResponseError;

  export type Response<T = boolean> = T extends object ? ResponseSuccess<T> : ResponseWithMessage;



// type for Product
type Product = {
  salePrice: number;
  discount?: number | null;
  taxId?: string | null;
  tax?: number | null;
  name: string
};

// type for Variant Option
type VariantOption= {
  value: string;
}
type User = {
  name: string;
  email: string;
};

// type for Variant
type Variant = {
  salePrice: number;
  variant: {
    id: string;
    name: string;
    status: boolean;
  };
  option: VariantOption;
}

// type for Cart Item
type CartItem =  {
  quantity: number;
  amount: number;
  product: Product;
  variants: Variant[] ;
}

// type for Order
export type OrderType ={
  id: string;
  orderDate: string;
  quantity: number;
  deliveryDate: string;
  amount: number | null;
  streetAddress: string;
  state: string;
  city: string;
  status: string;
  paymentStatus: boolean;
  paymentId: string | null;
  userId: string;
  carts: CartItem[];
  user: User ; 
} | null


export type InvoiceType = OrderType &{
  InvoiceId: string;
  invoiceDate: string;
  totalAmount: number; 
};