import enum

class UserRole(enum.Enum):
    OPERATOR = "operator"
    MANAGER = "manager"
    NGO = "ngo"
    MINISTRY = "ministry"

class UserStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class SectorStatus(enum.Enum):
    MINED = "mined"
    CLEAR = "clear"
    PROBABLE = "probable"

