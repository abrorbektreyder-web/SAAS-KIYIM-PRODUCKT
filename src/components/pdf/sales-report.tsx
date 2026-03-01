'use client';

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Agar o'zbek tilidagi lotin/kirill harflarni PDF da to'g'ri chiqarish ko'zlangan bo'lsa Roboto kabi fontni yuklash mumkin
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
        fontFamily: 'Helvetica'
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#1a1a1a',
        fontWeight: 'bold'
    },
    subHeader: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 30,
        textAlign: 'center'
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#bfdbfe'
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row'
    },
    tableColHeader: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#bfdbfe',
        backgroundColor: '#eff6ff'
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#bfdbfe'
    },
    tableCellHeader: {
        margin: 8,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1e3a8a'
    },
    tableCell: {
        margin: 8,
        fontSize: 10,
        color: '#333333'
    },
    totalSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 10
    },
    totalText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a'
    }
});

interface SalesReportProps {
    data: any[];
    title: string;
    totalAmount: number;
}

export const SalesReportPDF = ({ data, title, totalAmount }: SalesReportProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>HOYR - Tashkilot Hisoboti</Text>
            <Text style={styles.subHeader}>{title}</Text>

            <View style={styles.table}>
                {/* Header Row */}
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableColHeader, width: '40%' }}>
                        <Text style={styles.tableCellHeader}>Mahsulot</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '20%' }}>
                        <Text style={styles.tableCellHeader}>Sotuvlar soni</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '40%' }}>
                        <Text style={styles.tableCellHeader}>Summa</Text>
                    </View>
                </View>

                {/* Data Rows */}
                {data.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                        <View style={{ ...styles.tableCol, width: '40%' }}>
                            <Text style={styles.tableCell}>{item.name}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '20%' }}>
                            <Text style={styles.tableCell}>{item.sales}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '40%' }}>
                            <Text style={styles.tableCell}>{(item.sales * item.price).toLocaleString()} so'm</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.totalSection}>
                <Text style={styles.totalText}>Umumiy tushum: {totalAmount.toLocaleString()} so'm</Text>
            </View>
        </Page>
    </Document>
);
