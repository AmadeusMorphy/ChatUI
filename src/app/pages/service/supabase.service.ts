import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

interface Message {
  id: number;
  content: string;
  sender: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;
  private supabase: SupabaseClient;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private interval: any; 
  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }
  
  isSubscibed = false;
  
  ngOnInit(): void {
    this.subscribeToMessages(); // Subscribe to real-time messages
    this.loadMessages(); // Load initial messages
    this.getMessages(); // Load initial messages
    
    this.subscribeToMessages(); // Subscribe to messages for real-time updates
    if(this.isSubscibed){
      
      setInterval(() => {
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
        this.subscribeToMessages() // Reload messages every second (1000 ms)
        this.loadMessages();
        this.getMessages()
      
const channels = this.supabase.channel('custom-all-channel')
.on(
  'postgres_changes',
  { event: '*', schema: 'public', table: 'messages' },
  (payload) => {
    console.log('Change received!', payload)
  }
)
.subscribe()
    }, 1000);
  }
  }

  getMessages(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }

  async loadMessages() {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      this.messagesSubject.next(data || []);
    }
  }

  async sendMessage(content: string, sender: string) {
    // Create a temporary message and add it to the current messages
    const tempMessage: Message = { id: Date.now(), content, sender, created_at: new Date().toISOString() };
    this.messagesSubject.next([...this.messagesSubject.getValue(), tempMessage]);

    const { error } = await this.supabase.from('messages').insert([{ content, sender }]);
    if (error) {
      console.error('Error sending message:', error);
      // Optionally, remove the tempMessage if sending fails
    }
  }

  subscribeToMessages() {
    const channel = this.supabase
      .channel('realtime:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if(payload){
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to messages channel');
          this.isSubscibed === true;
          this.ngOnInit()
        }
      });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval); // Clear the interval when the component is destroyed
  }
}
