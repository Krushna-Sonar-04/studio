import { Announcement } from '@/lib/types';

export let mockAnnouncements: Announcement[] = [
    {
        id: 'anno-1',
        title: 'Planned Water Outage in Sector 15',
        message: 'Please be advised that there will be a planned water supply outage in all of Sector 15 on July 30th from 9 AM to 5 PM for urgent pipeline maintenance work. We regret any inconvenience caused.',
        priority: 'High',
        createdAt: '2024-07-28T11:00:00Z',
    },
    {
        id: 'anno-2',
        title: 'Road Closure on MG Road for Marathon',
        message: 'MG Road will be closed to all vehicular traffic on Sunday, August 4th, from 6 AM to 10 AM for the City Marathon event. Please use alternative routes.',
        priority: 'Medium',
        createdAt: '2024-07-27T15:30:00Z',
    },
    {
        id: 'anno-3',
        title: 'Community Park Cleanup Drive',
        message: 'Join us for a community cleanup drive at Central Park this Saturday at 8 AM. Let\'s work together to keep our city clean. Gloves and bags will be provided.',
        priority: 'Low',
        createdAt: '2024-07-26T09:00:00Z',
    }
];

export const addAnnouncement = (announcement: Announcement) => {
    mockAnnouncements.unshift(announcement);
};
