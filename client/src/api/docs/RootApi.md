# FastApi.RootApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**readRootGet**](RootApi.md#readRootGet) | **GET** / | Read Root



## readRootGet

> HelloWorldResponse readRootGet()

Read Root

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.RootApi();
apiInstance.readRootGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**HelloWorldResponse**](HelloWorldResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

