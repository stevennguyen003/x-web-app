import axios from "axios";
axios.defaults.withCredentials = true;

// HARDCODED FOR NOW
export const GROUPS_API = `${process.env.REACT_APP_BACKEND_URL}/api/groups`;

export interface Group {
    _id: string;
    name: string;
    userRoles: {
        [username: string]: 'admin' | 'editor' | 'user';
    };
    userScores: {
        [userId: string]: number;
    };
    userProgress: {
        [userId: string]: number;
    };
    userStreak: {
        [userId: string]: number;
    };
    userWeeklyProgress: {
        [userId: string]: {
            Mon: boolean;
            Tue: boolean;
            Wed: boolean;
            Thu: boolean;
            Fri: boolean;
        };
    };
    lastResetDate: Date;
    noteIds: string[];
    profilePicture: string;
    inviteLink: string;
}


const api = axios.create({
    withCredentials: true,
});

// Create a group
export const createGroup = async (name: string, creatorId: string) => {
    const newGroup = {
        name,
        userRoles: { [creatorId]: 'admin' },
        userScores: { [creatorId]: 0 },
        userProgress: { [creatorId]: 0 },
        userStreak: { [creatorId]: 0 },
        userWeeklyProgress: {
            [creatorId]: {
                Mon: false,
                Tue: false,
                Wed: false,
                Thu: false,
                Fri: false
            }
        },
        lastResetDate: new Date(),
        noteIds: [],
        profilePicture: '',
    };
    const response = await api.post(`${GROUPS_API}`, newGroup);
    return response.data;
};

// Join a group
export const joinGroup = async (group: any, userId: string) => {
    const joiningGroup = {
        ...group,
        userRoles: {
            ...group.userRoles,
            [userId]: 'user'
        },
        userScores: {
            ...group.userScores,
            [userId]: 0
        },
        userProgress: {
            ...group.userProgress,
            [userId]: 0
        },
        userStreak: {
            ...group.userStreak,
            [userId]: 0
        },
        userWeeklyProgress: {
            ...group.userWeeklyProgress,
            [userId]: {
                Mon: false,
                Tue: false,
                Wed: false,
                Thu: false,
                Fri: false
            }
        }
    };
    const response = await api.put(`${GROUPS_API}/${group._id}`, joiningGroup);
    return response.data;
};

// Find all groups
export const findAllGroups = async () => {
    const response = await api.get(`${GROUPS_API}`);
    return response.data;
};

// Find a group by their id
export const findGroupById = async (id: any) => {
    const response = await api.get(`${GROUPS_API}/id/${id}`);
    return response.data;
};

// Find a group by their invite link
export const findGroupByInviteCode = async (inviteCode: any) => {
    const response = await api.get(`${GROUPS_API}/invite/${inviteCode}`);
    return response.data;
}

// Update a group's info
export const updateGroup = async (group: any) => {
    const response = await api.put(`${GROUPS_API}/${group._id}`, group);
    return response.data;
};

// Delete a group
export const deleteGroup = async (group: any) => {
    const response = await api.delete(`${GROUPS_API}/${group._id}`);
    return response.data;
};

// Updates a group's profile picture
export const uploadProfilePicture = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.post(`${GROUPS_API}/${id}/uploadProfilePicture`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Uploads a note to the group
export const uploadNote = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('note', file);
    const response = await api.post(`${GROUPS_API}/${id}/uploadNote`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Find all notes from the group's array of IDs
export const findAllNotes = async (id: any) => {
    const response = await api.get(`${GROUPS_API}/${id}/findAllNotes`);
    return response.data;
}