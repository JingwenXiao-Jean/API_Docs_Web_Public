import { observer } from "mobx-react";
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import HardBreak from '@tiptap/extension-hard-break';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Italic from "@tiptap/extension-italic";
import Bold from "@tiptap/extension-bold";
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, Tooltip } from "@mui/material";
import ListKeymap from '@tiptap/extension-list-keymap';
import { Brush, DriveFileRenameOutline, Edit, FormatBold, FormatItalic, FormatListBulleted, FormatPaint, FormatUnderlinedOutlined, Highlight as HighlightIcon, KeyboardReturn, WrapText } from "@mui/icons-material";
import Underline from '@tiptap/extension-underline';
import { IsEmptyStr } from "../utilities/field-validation";

export const RichEditor = observer(forwardRef(({ value, disabled = false, className, onContentChange }: { value: string, disabled?: boolean, className?: string, onContentChange: (content: string) => any; }, ref: any) => {
  const editor: any = useEditor({
    extensions: [Document, Paragraph, Text, BulletList, ListItem, ListKeymap, Highlight, Italic, Bold, HardBreak, Underline, Heading.configure({ levels: [1, 2, 3] }),
      Placeholder.configure({
        placeholder: 'Your message goes to here...', // Customize the placeholder text
      })],
    content: value,
    editable: !disabled,
    autofocus: true,
    onUpdate: ({ editor }) => {
      // Call the onContentChange function when the content updates
      const html = editor.getHTML();
      onContentChange(html);
    },
  });

  useImperativeHandle(ref, () => ({
    clearContent: () => editor.commands.clearContent(),
    isEmptyContent: () => {
      const paragraphs = editor.getJSON().content;
      return paragraphs.every((paragraph: any) => IsEmptyStr(paragraph.content) || paragraph.content.length === 0);
    }
  }));

  if (!editor) return null;

  const getButtonStyle = (isActive: boolean) => `${isActive ? "is-active bg-gray-200" : ""} p-1 hover:bg-gray-100 transition-all rounded-md font-bold`;

  return (
    <>
      {!disabled && <Box className="flex gap-2 items-center mb-3 border-b pb-1">
        <Tooltip title="Bold" arrow>
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={getButtonStyle(editor.isActive('bold'))}>
            <FormatBold />
          </button>
        </Tooltip>
        <Tooltip title="Italic" arrow>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={getButtonStyle(editor.isActive('italic'))}>
            <FormatItalic />
          </button>
        </Tooltip>
        <Tooltip title="Underline" arrow>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={getButtonStyle(editor.isActive('underline'))}>
            <FormatUnderlinedOutlined sx={{ fontSize: 22 }} />
          </button>
        </Tooltip>

        <span className="block bg-gray-200 h-6 w-[1px]" />

        <Box className="flex" sx={{ marginTop: "-2px" }}>
          <Tooltip title="Heading 1" arrow>
            <button style={{ marginRight: 5 }} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={getButtonStyle(editor.isActive('heading', { level: 1 }))}>
              <p>H1</p>
            </button>
          </Tooltip>
          <Tooltip title="Heading 2" arrow>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={getButtonStyle(editor.isActive('heading', { level: 2 }))}>
              <p>H2</p>
            </button>
          </Tooltip>
        </Box>
        {/* <Tooltip title="Heading 3" arrow>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={getButtonStyle(editor.isActive('heading', { level: 3 }))}>
            H3
          </button>
        </Tooltip> */}
        <span className="block bg-gray-200 h-6 w-[1px]" />

        <Tooltip title="Highlight text" arrow>
          <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={getButtonStyle(editor.isActive('highlight'))}>
            <Box sx={{ marginTop: "-5px" }}>
              <Edit sx={{ fontSize: 18 }} />
              <span className="bg-yellow-400 block h-1 w-5" />
            </Box>
          </button>
        </Tooltip>

        <Tooltip title="Bullet list" arrow>
          <button style={{marginTop: -2}} onClick={() => editor.chain().focus().toggleBulletList().run()} className={getButtonStyle(editor.isActive('bulletList'))}>
            <FormatListBulleted />
          </button>
        </Tooltip>

        {/* <Tooltip title="Break line" arrow>
          <button onClick={() => editor.chain().focus().setHardBreak().run()} className={getButtonStyle(editor.isActive('break'))}>
            <WrapText />
          </button>
        </Tooltip> */}
      </Box>}
      <EditorContent editor={editor} className={className} />
    </>
  );
}));