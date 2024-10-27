import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { SupabaseService } from '../service/supabase.service';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

interface Message {
  content: string;
  sender: string;
  created_at: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  messages: Message[] = [];
  inputMessage = '';
   senderId = 'User123'; // Temporary sender ID for the example

  @ViewChild('chatBody') private chatBody!: ElementRef;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.supabaseService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });
    this.supabaseService.loadMessages();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.inputMessage.trim()) {
      this.supabaseService.sendMessage(this.inputMessage, this.senderId);
      this.inputMessage = '';
    }
  }

  // Auto-scroll to the bottom of the chat
  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
