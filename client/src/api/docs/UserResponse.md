# UserResponse

DTO for returning user information.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**userName** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**role** | [**UserRole**](UserRole.md) |  | [default to undefined]
**status** | [**UserStatus**](UserStatus.md) |  | [default to undefined]
**parent_user_id** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { UserResponse } from './api';

const instance: UserResponse = {
    id,
    userName,
    email,
    role,
    status,
    parent_user_id,
    created_at,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
