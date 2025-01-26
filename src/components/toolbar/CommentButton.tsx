import React, { useState } from 'react';
import { Button } from '../ui/button';
import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useToast } from '../ui/use-toast';

const CommentButton = () => {
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (comment.trim()) {
      // Here you would typically save the comment
      toast({
        title: "Comment Added",
        description: "Your comment has been saved successfully",
      });
      setComment('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-medical/20"
          title="Add Comment"
        >
          <MessageSquare size={20} className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Type your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmit}>Save Comment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentButton;