'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import styled from 'styled-components';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, AlignLeft, AlignCenter, 
  AlignRight, Image as ImageIcon, Link as LinkIcon,
  Heading1, Heading2, Quote, Undo, Redo, Eraser,
  Palette
} from 'lucide-react';
import { adminR2 } from '@/lib/api';
import { toast } from 'react-hot-toast';

/* ── Styled Components ────────────────────────────────────────────────── */

const EditorWrapper = styled.div`
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  background: #1a1a1a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 250px;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: #222;
  border-bottom: 1px solid #2a2a2a;
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ $active }) => ($active ? '#fff' : '#aaa')};
  background: ${({ $active }) => ($active ? '#333' : 'transparent')};
  transition: all 0.2s;

  &:hover {
    background: #333;
    color: #fff;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 20px;
  background: #333;
  margin: 6px 4px;
`;

const StyledEditorContent = styled(EditorContent)`
  .tiptap {
    padding: 16px;
    outline: none;
    color: #fff;
    font-size: 14px;
    line-height: 1.6;
    min-height: 200px;

    p {
      margin-bottom: 1em;
    }

    h1 { font-size: 1.8rem; margin: 1rem 0; }
    h2 { font-size: 1.5rem; margin: 0.8rem 0; }
    
    ul, ol {
      padding-left: 1.5rem;
      margin-bottom: 1em;
    }
    ul { list-style-type: disc; }
    ol { list-style-type: decimal; }

    blockquote {
      border-left: 3px solid #3b82f6;
      padding-left: 1rem;
      color: #aaa;
      font-style: italic;
      margin: 1rem 0;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1rem 0;
      display: block;
    }

    a {
      color: #3b82f6;
      text-decoration: underline;
      cursor: pointer;
    }

    &.ProseMirror-focused {
      /* Estilos extras se focado */
    }

    /* Placeholder style */
    p.is-editor-empty:first-child::before {
      color: #555;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
  }
`;

/* ── Main Component ────────────────────────────────────────────────── */

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Comece a escrever...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      ImageExtension,
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const loadingToast = toast.loading('Enviando imagem...');
        try {
          const { url } = await adminR2.uploadImage(file);
          editor.chain().focus().setImage({ src: url }).run();
          toast.success('Imagem enviada!', { id: loadingToast });
        } catch (error) {
          toast.error('Erro ao enviar imagem', { id: loadingToast });
          console.error(error);
        }
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do Link', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const onColorChange = (event: any) => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  return (
    <EditorWrapper>
      <Toolbar>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          $active={editor.isActive('bold')}
          title="Negrito"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          $active={editor.isActive('italic')}
          title="Itálico"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          $active={editor.isActive('underline')}
          title="Sublinhado"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <ToolbarButton
            type="button"
            title="Cor do Texto"
            as="label"
            htmlFor="text-color-picker"
            style={{ cursor: 'pointer' }}
          >
            <Palette size={16} color={editor.getAttributes('textStyle').color || '#aaa'} />
          </ToolbarButton>
          <input
            id="text-color-picker"
            type="color"
            onChange={onColorChange}
            value={editor.getAttributes('textStyle').color || '#ffffff'}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              zIndex: -1
            }}
          />
        </div>

        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Limpar Formatação"
        >
          <Eraser size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          $active={editor.isActive('heading', { level: 1 })}
          title="Título 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          $active={editor.isActive('heading', { level: 2 })}
          title="Título 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          $active={editor.isActive('bulletList')}
          title="Lista"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          $active={editor.isActive('orderedList')}
          title="Lista Numerada"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          $active={editor.isActive('blockquote')}
          title="Citação"
        >
          <Quote size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          $active={editor.isActive({ textAlign: 'left' })}
          title="Alinhar Esquerda"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          $active={editor.isActive({ textAlign: 'center' })}
          title="Centralizar"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          $active={editor.isActive({ textAlign: 'right' })}
          title="Alinhar Direita"
        >
          <AlignRight size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          type="button"
          onClick={setLink}
          $active={editor.isActive('link')}
          title="Link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={addImage}
          title="Inserir Imagem"
        >
          <ImageIcon size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Desfazer"
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Refazer"
        >
          <Redo size={16} />
        </ToolbarButton>
      </Toolbar>

      <StyledEditorContent editor={editor} />
    </EditorWrapper>
  );
}
