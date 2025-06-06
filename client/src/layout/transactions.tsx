// Example for Transactions Page (simplified)
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchAPI } from '../utils/api';

const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null); // For infinite scroll

    const loadTransactions = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const data = await fetchAPI(`/api/v1/transactions?page=${page}&limit=8`);
            setTransactions(prev => [...prev, ...data.transactions]);
            setHasMore(data.hasMore);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        loadTransactions();
    }, []); 

    // Infinite scroll logic
    const lastTransactionElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadTransactions();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadTransactions]);

    return (
        <div>
            <h1>Your Transactions</h1>
            {transactions.map((tx, index) => (
                <div key={tx.reference} ref={transactions.length === index + 1 ? lastTransactionElementRef : null} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <p>Ref: {tx.reference}</p>
                    <p>Amount: {tx.amount.toFixed(2)} {tx.currency}</p>
                    <p>Status: {tx.status}</p>
                    <p>Date: {new Date(tx.transactionDate).toLocaleString()}</p>
                </div>
            ))}
            {loading && <div>Loading more transactions...</div>}
            {!hasMore && <div>No more transactions</div>}
            {/* If not using infinite scroll, add a button: */}
            {/* {hasMore && !loading && <button onClick={loadTransactions}>Load More</button>} */}
        </div>
    );
};

export default TransactionsPage;