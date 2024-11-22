#### Err code 001

`.next/types/app/api/auth/signin/page.ts:34:29
Type error: Type 'Props' does not satisfy the constraint 'PageProps'.
  Types of property 'searchParams' are incompatible.
    Type 'ReadonlyURLSearchParams' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
  33 | // Check the prop type of the entry function  `


  stems from  const searchParams =  useSearchParams()

  Sol: I did not pas the props 

  