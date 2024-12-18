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
                    // Keep the toolbar glued to the top of the keyboard
                    const adjustedBottom = keyboardHeight - window.visualViewport.offsetTop;
                    document.documentElement.style.setProperty('--toolbar-bottom', `${adjustedBottom}px`);
                } else {
                    // Reset when the keyboard is not visible
                    document.documentElement.style.setProperty('--toolbar-bottom', '0px');
                }
            } else {
                // Reset if viewport width is larger than 1000px
                document.documentElement.style.setProperty('--toolbar-bottom', '0px');
            }
        };
    
        // Listen to both resize and scroll events
        window.visualViewport?.addEventListener('resize', updateToolbarPosition);
        window.visualViewport?.addEventListener('scroll', updateToolbarPosition);
    
        // Initial check to ensure position is set on load
        updateToolbarPosition();
    
        return () => {
            window.visualViewport?.removeEventListener('resize', updateToolbarPosition);
            window.visualViewport?.removeEventListener('scroll', updateToolbarPosition);
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
                    toolbar: '#custom-toolbar',
                },
                placeholder: '',
            });

            const editor = quillRef.current.querySelector('.ql-editor');

            const updatePlaceholder = () => {
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

            const toggleFormats = (button: Element, format: string) => {
                const handleClick = (e: Event) => {
                    e.preventDefault();
            
                    const editor = editorRef.current;
                    if (!editor) return;
            
                    const range = editor.getSelection();
                    if (range) {
                        editor.format(format, !editor.getFormat(range)[format]);
                    } else {
                        editor.format(format, true); // Apply to cursor position
                    }
                };
            
                // Desktop click
                button.addEventListener('click', handleClick);
            
                // Mobile: Add active class on touchstart
                button.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    (button as HTMLElement).classList.add('active');
                    handleClick(e);
                });
            
                button.addEventListener('touchend', () => {
                    (button as HTMLElement).classList.remove('active');
                });
            
                button.addEventListener('touchcancel', () => {
                    (button as HTMLElement).classList.remove('active');
                });
            };

            
            

            toggleFormats(toolbarContainer.querySelector('.ql-bold')!, 'bold');
            toggleFormats(toolbarContainer.querySelector('.ql-italic')!, 'italic');
            toggleFormats(toolbarContainer.querySelector('.ql-underline')!, 'underline');
            toggleFormats(toolbarContainer.querySelector('.ql-strike')!, 'strike');
            toggleFormats(toolbarContainer.querySelector('.ql-code-block')!, 'code-block');
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
                    <TooltipDescription text="Negrito">
                        <button className="ql-bold"></button>
                    </TooltipDescription>
                    <TooltipDescription text="Itálico">
                        <button className="ql-italic"></button>
                    </TooltipDescription>
                    <TooltipDescription text="Sublinhado">
                        <button className="ql-underline"></button>
                    </TooltipDescription>
                    <TooltipDescription text="Traçado">
                        <button className="ql-strike"></button>
                    </TooltipDescription>
                </span>
                <span className="separator"></span>
                <span className="ql-formats">
                    <TooltipDescription text="Adicionar código">
                        <button className="ql-code-block"></button>
                    </TooltipDescription>
                    <TooltipDescription text="Adicionar lista">
                        <button className="ql-list" value="bullet"></button>
                    </TooltipDescription>
                    <TooltipDescription text="Adicionar lista numérica">
                        <button className="ql-list" value="ordered"></button>
                    </TooltipDescription>
                </span>
                <span className="separator"></span>
                <span className="ql-formats">
                    <TooltipDescription text="Adicionar imagem">
                        <button className="ql-image"></button>
                    </TooltipDescription>
                    <TooltipDescription text="Adicionar bídeo">
                        <button className="ql-video"></button>
                    </TooltipDescription>
                    <TooltipDescription text="Adicionar link">
                        <button className="ql-link"></button>
                    </TooltipDescription>
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
