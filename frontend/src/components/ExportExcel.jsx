import React from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import defaultInstance from '../../api/defaultInstance';

const ExportExcel = ({ calendarApi, selectedLocation, branches }) => {
    const formatLocalDateTime = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const pad = n => n.toString().padStart(2, '0');

        return (
            date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds())
        );
    };

    const handleExportExcel = async () => {
        if (!calendarApi) return;

        const currentDate = calendarApi.getDate();
        const formattedDate = formatLocalDateTime(currentDate).split('T')[0];

        try {
            const branchObj = branches.find(b => b.name === selectedLocation);
            const branchId = branchObj?.id;

            if (!branchId) {
                toast.error('ფილიალი არ არის არჩეული');
                return;
            }

            const response = await defaultInstance.get(`/events/export?date=${formattedDate}&branch_id=${branchId}`);
            const events = response.data;

            const wb = XLSX.utils.book_new();

            const headers = [
                '№ ',
                'ორგანიზაცია (მომწოდებელი)',
                'ავტომანქანის სახელმწიფო ნომერი',
                'პასუხისმგებელი პირის სახელი და გვარი (გადამზიდი)',
                'გრიფიკის მიხედვით მოსვლის დრო',
                'საწყობის ტერიტორიაზე შესვლის დრო',
                'საქონლის დაცლის დაწყების დრო',
                'საქონლის დაცლის დასრულების დრო',
                'მიმთვლელის ხელმოწერა',
                'გადამზიდის (მძღოლის) ხელმოწერა'
            ];

            const data = events.map((event, index) => {
                const eventDate = new Date(event.event_date);
                const time = `${eventDate.getHours().toString().padStart(2, '0')}:${eventDate.getMinutes().toString().padStart(2, '0')}`;

                return [
                    index + 1,
                    event.supplier || '',
                    '',
                    '',
                    time,
                    '',
                    '',
                    '',
                    '',
                    ''
                ];
            });

            const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

            const wscols = [
                { wch: 5 },
                { wch: 30 },
                { wch: 20 },
                { wch: 30 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 }
            ];
            ws['!cols'] = wscols;

            const range = XLSX.utils.decode_range(ws['!ref']);

            for (let R = range.s.r; R <= range.e.r; R++) {
                for (let C = range.s.c; C <= range.e.c; C++) {
                    const cell_address = { c: C, r: R };
                    const cell_ref = XLSX.utils.encode_cell(cell_address);

                    if (!ws[cell_ref]) continue;

                    if (!ws[cell_ref].s) ws[cell_ref].s = {};

                    ws[cell_ref].s = {
                        font: { name: 'Arial', sz: 11 },
                        alignment: { vertical: 'center', horizontal: R === 0 || C === 0 || C === 4 ? 'center' : 'left', wrapText: true },
                        ...(R === 0 && {
                            font: { name: 'Arial', sz: 11, bold: true },
                            fill: { fgColor: { rgb: 'F2F2F2' } }
                        })
                    };

                    ws[cell_ref].s.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }

            XLSX.utils.book_append_sheet(wb, ws, 'Events');

            const fileName = `${selectedLocation}_${formattedDate}.xlsx`;

            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success('ფაილი წარმატებით ჩამოიტვირთა');
        } catch (error) {
            console.error('Excel export failed:', error);
            toast.error('ექსპორტი ვერ მოხერხდა: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <button className="export-button" onClick={handleExportExcel}>
            <FileDownloadIcon />
            Excel-ში ექსპორტი
        </button>
    );
};

export default ExportExcel;
