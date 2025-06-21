# RootApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**readRootGet**](#readrootget) | **GET** / | Read Root|

# **readRootGet**
> HelloWorldResponse readRootGet()


### Example

```typescript
import {
    RootApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RootApi(configuration);

const { status, data } = await apiInstance.readRootGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**HelloWorldResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

