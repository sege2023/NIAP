import React, { useEffect, useState } from 'react'; 
import { fetchAPI } from '../utils/api'; 
import styles from '../styles/transactions.module.css'; 
import LoadingIndicator from './loading';
const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); 
    const [totalTransactions, setTotalTransactions] = useState(0); // From backend pagination

    const limit = 8; 

    const loadTransactions = async (pageNum: number) => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const fetchUrl = `/api/v1/transactions?page=${pageNum}&limit=${limit}`;
            console.log("Fetching from:", fetchUrl);

            const data = await fetchAPI(fetchUrl);
            console.log("Fetched data from API:", data); // Log the raw data received

            if (Array.isArray(data.transactions)) {
                setTransactions(data.transactions);
                setTotalTransactions(data.totalTransactions);
            } else {
                console.error("API response transactions is not an array:", data.transactions);
                setError("Unexpected data format from server.");
            }
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
            setError("Failed to load transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions(1);
    }, []); 

    const handleNextPage = () => {
        if (page * limit < totalTransactions) { 
            setPage(prevPage => prevPage + 1);
            loadTransactions(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
            loadTransactions(page - 1);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.containerwrapper}>
                <div className={styles.transactionContainer}>
                    <h1>Your Transactions</h1>
                     {error && <div style={{ color: 'red' }}>{error}</div>}
                    <LoadingIndicator isLoading={loading} fallback={<div></div>}>
                        {transactions.length > 0 &&(
                            <>
                                {transactions.map((tx, index) => (
                                    <div key={tx.reference || index} className={styles.transactionItem}>
                                            <p>Ref: {tx.reference}</p>
                                            <p>Amount: {typeof tx.amount === 'number' ? tx.amount.toFixed(2) : 'N/A'} {tx.currency || ''}</p>
                                            <p>Status: {tx.status}</p>
                                            <p>Date: {tx.transactionDate ? new Date(tx.transactionDate).toLocaleString() : 'N/A'}</p>
                                            {tx.type === 'deposit' && (
                                                <>
                                                    <p>Gateway: {tx.gatewayResponse || 'N/A'}</p>
                                                    <p>Channel: {tx.channel || 'N/A'}</p>
                                                </>
                                            )}
                                            {tx.type && tx.type.startsWith('transfer_') && (
                                                <p>Type: {tx.type.replace('_', ' ')}</p>
                                            )}
                                    </div>
                                ))}

                                <div className={styles.pagination}>
                                    <button onClick={handlePrevPage} disabled={page === 1 || loading}>
                                        Previous
                                    </button>
                                    <span>Page {page} of {Math.ceil(totalTransactions / limit)}</span>
                                    <button onClick={handleNextPage} disabled={page * limit >= totalTransactions || loading}>
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                    </LoadingIndicator>
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;