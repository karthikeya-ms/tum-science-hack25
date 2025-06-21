import enum


class UserRole(enum.Enum):
    OPERATOR = "operator"
    TEAM_LEAD = "Team-Lead"
    NGO = "ngo"
    MINISTRY = "ministry"


class UserStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


class SectorStatus(enum.Enum):
    MINED = "mined"
    DEMINED = "demined"
    CLEAR = "clear"
    PROBABLE = "probable"
