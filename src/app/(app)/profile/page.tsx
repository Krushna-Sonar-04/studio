
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Briefcase, Building, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return <div className="text-center">Loading profile... Please log in.</div>;
    }

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[1][0]}`;
        }
        return names[0].substring(0, 2);
    };

    const profileItems = [
        { icon: User, label: 'Name', value: user.name },
        { icon: Mail, label: 'Email', value: user.email },
        { icon: Phone, label: 'Phone', value: user.phone },
        { icon: Briefcase, label: 'Role', value: user.role },
        { icon: Building, label: 'Department', value: user.department },
        { icon: Map, label: 'Zone', value: user.zone },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Your Profile</h1>
                <p className="text-muted-foreground">
                    View your personal and role-based information.
                </p>
            </div>
            <Card>
                <CardHeader className="flex flex-col items-center text-center">
                     <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.role}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    {profileItems.map(item => item.value && (
                        <div key={item.label} className="flex items-center gap-4 text-sm">
                            <item.icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold w-24">{item.label}:</span>
                            <span className="text-muted-foreground">{item.value}</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="h-5 w-5 flex-shrink-0"></div>
                        <span className="font-semibold w-24">Status:</span>
                        <Badge variant={user.active ? 'default' : 'destructive'}>
                            {user.active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
