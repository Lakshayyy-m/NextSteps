"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserBook {
  publicUrl: string;
  data: {
    id: string;
    bucketId: string;
    name: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
  };
}

interface UserBooksProps {
  books: UserBook[];
  onDelete?: (bookId: string) => void;
}

const UserBooks = ({ books, onDelete }: UserBooksProps) => {
  if (!books || books.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center my-20">
        <div className="max-w-5xl w-[80%]">
          <h2 className="text-3xl font-bold text-center mb-8">Your Books</h2>
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No books uploaded yet. Upload your first book above!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center my-20">
      <div className="max-w-5xl w-[80%]">
        <h2 className="text-3xl font-bold text-center mb-8">Your Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => {
            const fileName =
              book.data.name?.split("/").pop()?.split("__")[0] ||
              "Unknown Book";

            return (
              <Card
                key={book.data.id || index}
                className="group hover:shadow-lg transition-shadow bg-secondary"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <BookOpen className="h-8 w-8 text-primary mb-2" />
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(book.data.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    {fileName}
                  </CardTitle>
                  <CardDescription>
                    Uploaded{" "}
                    {new Date(book.data.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => window.open(book.publicUrl, "_blank")}
                  >
                    View Book
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserBooks;
