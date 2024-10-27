import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

interface Message {
  text: string;
  sent: boolean;
  id: number;
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
export class ChatComponent implements AfterViewChecked {
  messages: Message[] = [
    {
      text: 'test', sent: false, id: 100
    },
    {
      text: 'Meee', sent: true, id: 69

    },
    {
      text: 'this is me', sent: true, id: 69

    },
    {
      text: 'this is you', sent: false, id: 100

    },
    {
      text: 'Yupp', sent: false, id: 100

    }
  ];
  inputMessage = '';

  @ViewChild('chatBody') private chatBody!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.inputMessage.trim()) {
      this.messages.push({ text: this.inputMessage, sent: true, id: 69 });
      this.inputMessage = '';
      this.reply();
    }
  }

  reply() {
    setTimeout(() => {
      const responses = [
        "Hello! How can I help?",
        "Great to hear from you!",
        "I'm here to chat.",
        "Feel free to ask anything!",
        "What's on your mind?",
      ];
      const replyMessage = responses[Math.floor(Math.random() * responses.length)];
      this.messages.push({ text: replyMessage, sent: false, id: 100 });
    }, 1000);
  }

  // Method to scroll to the bottom of the chat
  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
