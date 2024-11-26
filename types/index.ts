


import { Cart, User,Product, ProductVariant, VariantOption, Variant, Tax ,Order} from "@prisma/client";


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







export type CartType = (Cart & {
  product: {
    name: string;
    discount: number | null;
    salePrice: number | null;
    tax: {
      rate: number;
    } | null;
  } | null; 
  variants: (ProductVariant & {
    option: VariantOption | null;
    variant: Variant;
  })[];
})[];


export type OrderType = (Order & {
  user: User;
  carts: ( {
    quantity: number;
    amount: number | null;
    product: {
      id: string;
      name: string;
      salePrice: number | null;
    } | null;
    variants: ( {
      salePrice: number | null;
      variant: Variant;
      option: {
        value: string;
      } | null;
    })[];
  })[];
}) | null;


export type InvoiceType = {
  InvoiceId: string; // Unique invoice identifier
  invoiceDate: Date; // Date of the invoice
  order: {
    id: string; // Order ID
    state: string; // Order state
    orderDate: Date; // Order date
    streetAddress: string; // Street address for delivery
    city: string; // City for delivery
    user: {
      email: string | null; // User's email
      name: string | null; // User's name
    } ;
    carts: {
      quantity: number; // Quantity of items in the cart
      amount: number | null; // Total amount for the cart item
      product: {
        name: string; // Product name
        salePrice: number | null; // Sale price of the product
        discount: number | null; // Discount on the product (nullable)
        taxId: string | null; // Tax ID associated with the product (nullable)
        tax: {
          rate: number; // Tax rate applied to the product
        } | null; // Tax details (nullable)
      };
      variants: {
        discount: number | null; // Discount on the variant (nullable)
        salePrice: number | null; // Sale price of the variant (nullable)
        variant: {
          id: string; // Variant ID
          name: string; // Variant name
          status: boolean; // Variant status (active/inactive)
        };
        option: {
          value: string; // Value of the variant option
        } | null; // Variant option (nullable)
      }[] ;
    }[] ;
  } | null;
} | null;


export type InvoiceDataType = {
  id: string; // Order ID
  state: string; // Order state
  orderDate: Date; // Order date
  streetAddress: string; // Street address for delivery
  city: string; // City for delivery
  user: {
    email: string | null; // User's email (nullable)
    name: string | null; // User's name (nullable)
  };
  carts: {
    quantity: number; // Quantity of items in the cart
    amount: number; // Total amount for the cart item (default to 0 if null)
    product: {
      name: string; // Product name
      salePrice: number; // Sale price of the product
      discount: number | null; // Discount on the product (nullable)
      taxId: string | null; // Tax ID associated with the product (nullable)
      tax: {
        rate: number; // Tax rate applied to the product
      } | null; // Tax details (nullable)
    };
    variants: {
      discount: number | null; // Discount on the variant (nullable)
      salePrice: number; // Sale price of the variant
      variant: {
        id: string; // Variant ID
        name: string; // Variant name
        status: boolean; // Variant status (active/inactive)
      };
      option: {
        value: string; // Value of the variant option
      } | null; // Variant option (nullable)
    }[];
  }[];
  InvoiceId: string; // Invoice ID
  invoiceDate: Date; // Invoice date
};


export type OrderWithCartsType = Order & {
  
  carts: {
    quantity: number; // Quantity of items in the cart
    amount: number | null; // Amount for the cart item (nullable)
    product: {
      id: string; // Product ID
      name: string; // Product name
      salePrice: number | null; // Sale price of the product (nullable)
      image:string | null;
      description: string | null;
    } | null; // Product details (nullable)
    variants: {
      salePrice: number | null; // Sale price of the variant (nullable)
      variant: {
        id: string; // Variant ID
        name: string; // Variant name
        status: boolean; // Variant status (active/inactive)
      };
      option: {
        value: string; // Option value for the variant
      } | null; // Variant option (nullable)
    }[]; // List of variants for the product
  }[]; // List of carts for the order
};



export type ProductOneType = Product & {
  category:{
    categoryName: string
  };
  tax?: {
    rate: number
  } | null, 
  ProductVariant: (ProductVariant & {
    variant: Variant;
    option: VariantOption | null;
  })[];
}| null | undefined;

export type productVariantType =  {
  name: string;
  options: {
      id: string;
      value: string;
      var_id: string;
      variantName: string | null;
  }[];
}[] | null | undefined;


export type supplierType =  {
  id: string ;
  email: string | null;
  phone: string | null;
  address: string | null;
  _count: {
      products: number;
  };
  supplierName: string;
}[];


export type categoryType =  {
  id: string;
  categoryName: string;
  description: string | null;
}[];


export type SelectType= {
  id: string;
  label: string;
  value: string;
};

export type taxType = {
  id: string;
  name: string;
  rate: number;
};
