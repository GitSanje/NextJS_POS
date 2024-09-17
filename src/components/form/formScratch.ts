

  // type FormData = z.infer<typeof productSchema>;
  // const onSubmit = (data: FormData) => {
  //   console.log(data);
  // };


  // form.handleSubmit(onSubmit, onInvalid)
  

  //   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   //event.preventDefault();
  //   console.log(Object.fromEntries(new FormData(event.currentTarget)));
  // };
    //  values = JSON.parse(JSON.stringify(values))
  // const processedValues: any = { ...values };
  // if(processedValues.image instanceof File){
  //   const base64Image = await fileToBase64(processedValues.image);
  //   processedValues.image = base64Image
  // }
  
  // const formData:productType = new FormData();
    
  // Loop through the values and append them to FormData
  // for (const [key, value] of Object.entries(values)) {
  //   if (key === 'image' && value instanceof File) {
  //     // Append file directly
  //     console.log(value,key);
      
  //     values[key]= value;
  //   } else if (Array.isArray(value) ) {
  //     // Convert arrays to JSON string
  //     values[key]= JSON.stringify(value);
  //   } else {
  //     // Append other types as strings
  //     values[key] = value as string;
  //   }
  // }
  // console.log(processedValues);
  
      