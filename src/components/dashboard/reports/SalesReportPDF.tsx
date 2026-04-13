'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Font registratsiyasi (ixtiyoriy, agar maxsus font kerak bo'lsa)
// Hozircha standard Helvetica ishlatamiz

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: 1,
        borderBottomColor: '#eeeeee',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        marginTop: 5,
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 20,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 10,
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
    },
    tableCell: {
        margin: 5,
        fontSize: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        fontSize: 10,
        textAlign: 'center',
        color: '#999999',
    },
    totalSection: {
        marginTop: 20,
        textAlign: 'right',
        fontSize: 12,
        fontWeight: 'bold',
    }
});

interface SalesReportPDFProps {
    orders: any[];
    orgName: string;
    dateRange: string;
}

export const SalesReportPDF = ({ orders, orgName, dateRange }: SalesReportPDFProps) => {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Sotuv Hisoboti</Text>
                    <Text style={styles.subtitle}>{orgName}</Text>
                    <Text style={styles.subtitle}>{dateRange}</Text>
                </View>

                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '25%' }]}>
                            <Text style={styles.tableCellHeader}>Buyurtma №</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '25%' }]}>
                            <Text style={styles.tableCellHeader}>Mijoz</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={styles.tableCellHeader}>To'lov</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={styles.tableCellHeader}>Sana</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={styles.tableCellHeader}>Summa</Text>
                        </View>
                    </View>

                    {/* Body */}
                    {orders.map((order, i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: '25%' }]}>
                                <Text style={styles.tableCell}>{order.order_number}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '25%' }]}>
                                <Text style={styles.tableCell}>{order.customers?.full_name || '-'}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '15%' }]}>
                                <Text style={styles.tableCell}>{order.payment_method}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '20%' }]}>
                                <Text style={styles.tableCell}>{new Date(order.created_at).toLocaleDateString()}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '15%' }]}>
                                <Text style={styles.tableCell}>{order.total.toLocaleString()} so'm</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.totalSection}>
                    <Text>Jami sotuv: {totalSales.toLocaleString()} so'm</Text>
                </View>

                <Text style={styles.footer}>
                    Generatsiya qilindi: {new Date().toLocaleString()} | HOYR SaaS Platformasi
                </Text>
            </Page>
        </Document>
    );
};
