# SectorResponse

DTO for returning sector information, including nested user details.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**geometry** | **{ [key: string]: any; }** |  | [default to undefined]
**area_sqm** | **number** |  | [default to undefined]
**risk_probability** | **number** |  | [default to undefined]
**total_mines_found** | **number** |  | [default to undefined]
**status** | [**SectorStatus**](SectorStatus.md) |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**assigned_ngo** | [**UserResponse**](UserResponse.md) |  | [optional] [default to undefined]
**assigned_team_lead** | [**UserResponse**](UserResponse.md) |  | [optional] [default to undefined]
**assigned_operator** | [**UserResponse**](UserResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { SectorResponse } from './api';

const instance: SectorResponse = {
    id,
    geometry,
    area_sqm,
    risk_probability,
    total_mines_found,
    status,
    created_at,
    updated_at,
    assigned_ngo,
    assigned_team_lead,
    assigned_operator,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
