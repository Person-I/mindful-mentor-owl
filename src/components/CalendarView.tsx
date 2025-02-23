
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { API_URL } from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    date?: string;
  };
  end: {
    dateTime: string;
    date?: string;
  };
  description?: string;
  location?: string;
}

interface CalendarViewProps {
  userId: string;
}

export const CalendarView = ({ userId }: CalendarViewProps) => {
  const [webcalUrl, setWebcalUrl] = useState('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      
      const response = await axios.get(`${API_URL}calendar-events/`, {
        params: {
          user_id: userId,
          start_date: startDate,
          end_date: endDate,
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch calendar events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await axios.post(`${API_URL}calendar-sync/`, {
        user_id: userId,
        webcal_url: webcalUrl,
      });
      toast({
        title: "Success",
        description: "Calendar synchronized successfully",
      });
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync calendar",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 glass rounded-lg p-8">
      <form onSubmit={handleSync} className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Calendar Integration
        </h2>
        <div className="flex gap-4">
          <Input
            type="url"
            placeholder="Enter your Google Calendar WebCal URL"
            value={webcalUrl}
            onChange={(e) => setWebcalUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSyncing}>
            {isSyncing ? "Syncing..." : "Sync Calendar"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          To get your WebCal URL, go to your Google Calendar settings and find the "Secret address in iCal format"
        </p>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Upcoming Events</h3>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center text-muted-foreground">No upcoming events found</div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{event.summary}</h4>
                  {event.location && (
                    <Link className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatDateTime(event.start.dateTime || event.start.date || '')}
                </div>
                {event.description && (
                  <p className="text-sm mt-2 text-muted-foreground">
                    {event.description}
                  </p>
                )}
                {event.location && (
                  <div className="text-sm mt-2 text-muted-foreground">
                    📍 {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
