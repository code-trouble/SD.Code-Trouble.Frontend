import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import codespace from '../../assets/images/svg/codespace.svg';
import toolbarList from '../../assets/images/svg/toolbarList.svg';
import toolbarOrdered from '../../assets/images/svg/toolbarOrderedList.svg';
import toolbarImg from '../../assets/images/svg/toolbarImg.svg';
import toolbarVideo from '../../assets/images/svg/toolbarVideo.svg';
import toolbarLink from '../../assets/images/svg/toolbarLink.svg';
import favoriteBadge from '../../assets/images/svg/blueFavorite.svg';
import { Tag } from '../Tag';
import CustomButton from '../CustomButton';
import { TooltipDescription } from './TooltipDescription';

export const PostWriter: React.FC = () => {
    useEffect(() => {
        const updateToolbarPosition = () => {
            if (window.innerWidth <= 1000 && window.visualViewport) {
                const keyboardHeight = window.innerHeight - window.visualViewport.height;
                if (keyboardHeight > 0) {
                    const adjustedBottom = keyboardHeight - window.visualViewport.offsetTop;
                    document.documentElement.style.setProperty('--toolbar-bottom', `${adjustedBottom}px`);
                } else {
                    document.documentElement.style.setProperty('--toolbar-bottom', '0px');
                }
            } else {
                document.documentElement.style.setProperty('--toolbar-bottom', '0px');
            }
        };
        const onViewportChange = () => updateToolbarPosition();
        window.visualViewport?.addEventListener('resize', onViewportChange);
        window.visualViewport?.addEventListener('scroll', onViewportChange);
        updateToolbarPosition();
        return () => {
            window.visualViewport?.removeEventListener('resize', onViewportChange);
            window.visualViewport?.removeEventListener('scroll', onViewportChange);
        };
    }, []);

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
                    toolbar: {
                        container: '#custom-toolbar',
                        handlers: {
                            'bold': function(this: { quill: Quill }) {
                                const range = this.quill.getSelection();
                                if (range) {
                                    const format = this.quill.getFormat(range);
                                    this.quill.format('bold', !format.bold);
                                }
                            },
                            'italic': function(this: { quill: Quill }) {
                                const range = this.quill.getSelection();
                                if (range) {
                                    const format = this.quill.getFormat(range);
                                    this.quill.format('italic', !format.italic);
                                }
                            },
                            'underline': function(this: { quill: Quill }) {
                                const range = this.quill.getSelection();
                                if (range) {
                                    const format = this.quill.getFormat(range);
                                    this.quill.format('underline', !format.underline);
                                }
                            },
                            'strike': function(this: { quill: Quill }) {
                                const range = this.quill.getSelection();
                                if (range) {
                                    const format = this.quill.getFormat(range);
                                    this.quill.format('strike', !format.strike);
                                }
                            },
                            'code-block': function(this: { quill: Quill }) {
                                const range = this.quill.getSelection();
                                if (range) {
                                    const format = this.quill.getFormat(range);
                                    this.quill.format('code-block', !format['code-block']);
                                }
                            }
                        }
                    }
                },
                placeholder: '',
            });  
                        
            const updatePlaceholder = () => {
                const editor = quillRef.current?.querySelector('.ql-editor');
                const textLength = editorRef.current?.getText().trim().length;
                if (textLength === 0) {
                    editor?.setAttribute('data-placeholder', 'Escreva seu texto...');
                } else {
                    editor?.removeAttribute('data-placeholder');
                }
            };
    
            editorRef.current.on('text-change', updatePlaceholder);
            editorRef.current.on('selection-change', (range) => {
                if (range == null) {
                    updatePlaceholder();
                }
            });
            updatePlaceholder();
    
            // Customize toolbar icons
            setTimeout(() => {
                const toolbarContainer = document.getElementById('custom-toolbar')!;
    
                const replaceIcon = (selector: string, newIcon: string) => {
                    const button = toolbarContainer.querySelector(selector);
                    if (button) {
                        button.innerHTML = newIcon;
                    }
                };
    
                replaceIcon('.ql-bold', 'Bold');
                replaceIcon('.ql-italic', 'Italic');
                replaceIcon('.ql-underline', 'Underline');
                replaceIcon('.ql-strike', 'Strike');
                replaceIcon('.ql-list[value="bullet"]', `<img src="${toolbarList}" alt="Bullet List" />`);
                replaceIcon('.ql-list[value="ordered"]', `<img src="${toolbarOrdered}" alt="Ordered List" />`);
                replaceIcon('.ql-code-block', `<img src="${codespace}" alt="Code Block" />`);
                replaceIcon('.ql-link', `<img src="${toolbarLink}" alt="Link" />`);
                replaceIcon('.ql-image', `<img src="${toolbarImg}" alt="Image" />`);
                replaceIcon('.ql-video', `<img src="${toolbarVideo}" alt="Video" />`);
            }, 0);
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


    useEffect(() => {
        const adjustDropdownPosition = () => {
            const dropdown = document.querySelector('.tags-dropdown') as HTMLElement | null;
            const container = dropdown?.parentElement as HTMLElement | null;
            if (!dropdown || !container) return;
            const dropdownRect = dropdown.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            dropdown.style.left = '';
            dropdown.style.right = '';
            if (dropdownRect.left < 0) {
                dropdown.style.left = '0';
                dropdown.style.right = 'auto';
            }
            if (dropdownRect.right > viewportWidth) {
                dropdown.style.right = '0';
                dropdown.style.left = 'auto';
            }
        };
        if (dropdownOpen) {
            adjustDropdownPosition();
            window.addEventListener('resize', adjustDropdownPosition);
        } else {
            window.removeEventListener('resize', adjustDropdownPosition);
        }
        return () => {
            window.removeEventListener('resize', adjustDropdownPosition);
        };
    }, [dropdownOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const editorContent = editorRef.current?.root.innerHTML || "";
        console.log("Conteúdo enviado:", editorContent);
        console.log("Tags selecionadas:", selectedTags);
    };

    return (
        <div className="postWriter-container">
            <div className="submitArea">
                <div className='submitButtons'>
                    <button>
                        <img src={favoriteBadge} alt="favoritar"/>
                    </button>
                    <CustomButton
                        text='Postar'
                        padding='10px 100px'
                        color='white'
                        backgroundColor='#3348A4'
                        fontSize='18px'
                        fontWeight='500'
                    />
                </div>
            </div>
            <div id="custom-toolbar" className="custom-toolbar">
                <span className="ql-formats">
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Negrito">
                            <button className="ql-bold"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-bold"></button>
                    )}
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Itálico">
                            <button className="ql-italic"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-italic"></button>
                    )}
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Sublinhado">
                            <button className="ql-underline"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-underline"></button>
                    )}
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Traçado">
                            <button className="ql-strike"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-strike"></button>
                    )}
                </span>
                <span className="separator"></span>
                <span className="ql-formats">
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Adicionar código">
                            <button className="ql-code-block"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-code-block"></button>
                    )}
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Adicionar lista">
                            <button className="ql-list" value="bullet"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-list" value="bullet"></button>
                    )}
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Adicionar lista numérica">
                            <button className="ql-list" value="ordered"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-list" value="ordered"></button>
                    )}
                </span>
                <span className="separator"></span>
                <span className="ql-formats last-ql-format">
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Adicionar imagem">
                            <button className="ql-image"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-image"></button>
                    )}
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Adicionar bídeo">
                            <button className="ql-video"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-video"></button>
                    )}
                    {window.innerWidth > 1200 ? (
                        <TooltipDescription text="Adicionar link">
                            <button className="ql-link"></button>
                        </TooltipDescription>
                    ) : (
                        <button className="ql-link"></button>
                    )}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="editor-form">
                <div className="editor-container">
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
                                        .filter((tag) => !selectedTags.includes(tag)).length === 0 ? (
                                            <span>There are no tags left.</span>
                                        ) : 
                                        allTags
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
                    <div ref={quillRef} className="editor-area"></div>
                </div>
            </form>
        </div>
    );
};
