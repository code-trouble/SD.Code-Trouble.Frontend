import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import codespace from '../../assets/images/svg/codespace.svg';
import toolbarList from '../../assets/images/svg/toolbarList.svg';
import toolbarOrdered from '../../assets/images/svg/toolbarOrderedList.svg';
import toolbarImg from '../../assets/images/svg/toolbarImg.svg';
import toolbarVideo from '../../assets/images/svg/toolbarVideo.svg';
import toolbarLink from '../../assets/images/svg/toolbarLink.svg';
import { Tag } from '../Tag';

export const PostWriter: React.FC = () => {
    const quillRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Quill | null>(null);

    const allTags = [
        "Formatação",
        "Medium",
        "Dicas",
        "Conteúdo DIgital",
        "Experiência",
        "Web",
        "Figma",
        "Corinthians",
        "Libertadores",
        "CDB"
    ];    
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (quillRef.current) {
            editorRef.current = new Quill(quillRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: '#custom-toolbar',
                },
                placeholder: 'Escreva seu texto...',
            });

            const editor = quillRef.current.querySelector('.ql-editor');
            if (editor) {
                editor.setAttribute('data-placeholder', 'Escreva seu texto...');
            }

            editorRef.current.on('text-change', () => {
                if (editorRef.current?.getText().trim().length === 0) {
                    editor?.setAttribute('data-placeholder', 'Escreva seu texto...');
                } else {
                    editor?.removeAttribute('data-placeholder');
                }
            });
            
            const icons = Quill.import('ui/icons') as Record<string, string>;
            Object.keys(icons).forEach((key) => {
                icons[key] = ''; 
            });

            
            const toolbarContainer = document.getElementById('custom-toolbar')!;
            toolbarContainer.querySelector('.ql-bold')!.innerHTML = 'Bold';
            toolbarContainer.querySelector('.ql-italic')!.innerHTML = 'Italic';
            toolbarContainer.querySelector('.ql-underline')!.innerHTML = 'Underline';
            toolbarContainer.querySelector('.ql-strike')!.innerHTML = 'Strike';

            toolbarContainer.querySelector('.ql-list[value="bullet"]')!.innerHTML = `<img src="${toolbarList}" alt="Bullet List" />`;
            toolbarContainer.querySelector('.ql-list[value="ordered"]')!.innerHTML = `<img src="${toolbarOrdered}" alt="Ordered List" />`;
            toolbarContainer.querySelector('.ql-code-block')!.innerHTML = `<img src="${codespace}" alt="Code Block" />`;

            toolbarContainer.querySelector('.ql-link')!.innerHTML = `<img src="${toolbarLink}" alt="Link" />`;
            toolbarContainer.querySelector('.ql-image')!.innerHTML = `<img src="${toolbarImg}" alt="Image" />`;
            toolbarContainer.querySelector('.ql-video')!.innerHTML = `<img src="${toolbarVideo}" alt="Video" />`;
        }
    }, []);

    const handleAddTag = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([tag, ...selectedTags]); 
        }
        setDropdownOpen(false); 
    };

    const handleRemoveTag = (tag: string) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const editorContent = editorRef.current?.root.innerHTML || "";
        console.log("Conteúdo enviado:", editorContent);
        console.log("Tags selecionadas:", selectedTags);
    };

    return (
        <div className="postWriter-container">
            {/* Toolbar */}
            <div id="custom-toolbar" className="custom-toolbar">
                <span className="ql-formats">
                    <button className="ql-bold"></button>
                    <button className="ql-italic"></button>
                    <button className="ql-underline"></button>
                    <button className="ql-strike"></button>
                </span>

                <span className='separator'></span>
                
                <span className="ql-formats">
                    <button className="ql-code-block"></button>
                    <button className="ql-list" value="bullet"></button>
                    <button className="ql-list" value="ordered"></button>
                </span>

                <span className='separator'></span>

                <span className="ql-formats">
                    <button className="ql-image"></button>
                    <button className="ql-video"></button>
                    <button className="ql-link"></button>
                </span>
            </div>
    
            {/* Parte branca (inclui inputs e editor) */}
            <form onSubmit={handleSubmit} className="editor-form">
                <div className="editor-container">
                    {/* Campo de título */}
                    <textarea
                        placeholder="Título"
                        className="editor-title"
                        onInput={(e) => {
                            e.currentTarget.style.height = "auto";
                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                        }}
                    />

                    <div className="editor-tags">
                        {selectedTags.length > 0 && (
                            <div className="tags-container">
                                <Tag
                                    tags={selectedTags}
                                    onTagRemove={handleRemoveTag}
                                />
                            </div>
                        )}
                        <div className="tags-button-wrapper">
                            <button
                                className="tags-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown();
                                }}
                            >
                                {selectedTags.length === 0 ? "Adicione tags +" : "+"}
                            </button>
                            {dropdownOpen && (
                                <div className="tags-dropdown">
                                    {allTags
                                        .filter((tag) => !selectedTags.includes(tag))
                                        .map((tag, index) => (
                                            <button
                                                key={index}
                                                className="dropdown-tag-item"
                                                onClick={() => handleAddTag(tag)}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>


    
                    {/* Área do editor */}
                    <div ref={quillRef} className="editor-area"></div>
                </div>
    
                {/* Botão de enviar */}
                <button type="submit" className="submit-button">
                    Enviar Post
                </button>
            </form>
        </div>
    );
};
