import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Admin.module.css';
import utils from '@/styles/Utils.module.css';
import { ChevronDown, Search } from 'lucide-react';

interface User {
    id: string; // uid or id
    displayName?: string;
    email?: string;
}

interface SearchableUserSelectProps {
    users: User[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchableUserSelect: React.FC<SearchableUserSelectProps> = ({ users, value, onChange, placeholder = "Selecione..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Find selected user for display
    const selectedUser = users.find(u => u.id === value);

    // Filter users based on search
    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = user.displayName?.toLowerCase().includes(searchLower);
        const emailMatch = user.email?.toLowerCase().includes(searchLower);
        return nameMatch || emailMatch;
    });

    // Handle clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (userId: string) => {
        onChange(userId);
        setIsOpen(false);
        setSearchTerm(''); // Clear search on select or keep it? Clearing is usually better for "resetting" the dropdown state
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Focus input when opening?
        }
    };

    return (
        <div className={styles.dropdownContainer} ref={containerRef}>
            <div
                className={`${styles.input} ${utils.cursorPointer} ${utils.flexRow} ${utils.justifyBetween}`}
                onClick={toggleDropdown}
            >
                <span className={selectedUser ? '' : utils.textMuted}>
                    {selectedUser ? (selectedUser.displayName || selectedUser.email) : placeholder}
                </span>
                <ChevronDown size={18} color="#999" />
            </div>

            {isOpen && (
                <div className={styles.dropdownList}>
                    <div className={styles.dropdownSearchContainer}>
                        <div className={styles.dropdownSearchWrapper}>
                            <Search size={16} color="#999" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.dropdownSearchInput}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className={styles.dropdownItem}
                                onClick={() => handleSelect(user.id)}
                            >
                                <span className={styles.dropdownItemName}>{user.displayName || 'Sem Nome'}</span>
                                <span className={styles.dropdownItemEmail}>{user.email}</span>
                            </div>
                        ))
                    ) : (
                        <div className={styles.dropdownNoResult}>
                            Nenhum usuário encontrado.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableUserSelect;
