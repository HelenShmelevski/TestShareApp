import React, {forwardRef, useEffect, useState} from 'react';

import './App.css';
import Grid from '@material-ui/core/Grid'
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Alert from '@material-ui/lab/Alert';
import {CanvasJSChart} from 'canvasjs-react-charts';
import {ShareApiProvider} from './ShareApiProvider';


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

function App() {

    const columns = [
        {title: "id", field: "id", hidden: true},
        {title: "Дата", field: "date", type: 'date'},
        {title: "Компания", field: "company"},
        {title: "Цена", field: "cost", type: 'numeric'}
    ];
    const shareProvider = new ShareApiProvider();
    const [data, setData] = useState([]); //table data
    const [iserror, setIserror] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [chart, setChart] = useState({
        theme: "light2",
        title: {
            text: "Цены на акции"
        },
        axisX: {
            title: "Дата покупки",
            valueFormatString: "DD MM YYYY"
        },
        axisY: {
            title: "Стоимость"
        },
        data: []
    });

    const loadData = () => {
        shareProvider.get()
            .then(res => {
                setData(res.data);
                drawChart(res.data);
            })
            .catch(error => {
                setErrorMessages(["Ошибка загрузки данных!"]);
                setIserror(true);
            })
    };

const drawChart =(data) =>{
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    let group_data = {};
    let groupKey = [...new Set(data.map(o => o.company))];
    data.forEach((row) => {
        if (group_data[row.company]) {
            group_data[row.company].push(row);
        } else {
            group_data[row.company] = [row];
        }
    });
    let newChart = Object.assign({}, chart);
    let chartData = [];
    let minY = Math.min(...sortedData.map(o => o.cost)) - 300;
    let maxY = Math.max(...sortedData.map(o => o.cost)) + 300;
    groupKey.forEach(company => {
        chartData.push({
            type: "spline",
            xValueFormatString: "DD MM YYYY",
            name: company,
            showInLegend: true,
            dataPoints: group_data[company].map(o => {
                return {x: new Date(o.date), y: o.cost}
            })
        });

    });
    newChart.data = chartData;
    newChart.axisY.minimum = minY;
    newChart.axisY.maximum = maxY;
    setChart(newChart)
}

    const validPeriod = (start, end, dateString) => {
        return start <= dateString && dateString <= end;
    };

    const isValidDate = (dateString) => {
        return validPeriod(new Date("1556-01-01"), new Date(), new Date(dateString));
    };

    useEffect(() => {
        loadData();
    }, []);

    const validateData = (data) => {
        let errorList = [];
        if (data.date === "" || !isValidDate(data.date)) {
            errorList.push("Ошибка! Не верное значение даты. Попробуйте еще раз")
        }
        if (data.company === "") {
            errorList.push("Ошибка! Отсутствует название компании. Попробуйте еще раз")
        }
        if (data.cost === "" || data.cost <= 0) {
            errorList.push("Ошибка! Не верное значение цены. Попробуйте еще раз")
        }
        return errorList;
    }

    const handleRowUpdate = (newData, oldData, resolve) => {
        let errorList = validateData(newData);
        if (errorList.length === 0) {
            shareProvider.update(newData)
                .then(res => {
                    loadData();
                    resolve();
                    setIserror(false);
                    setErrorMessages([])
                })
                .catch(error => {
                    setErrorMessages(["Ошибка обновления!"]);
                    setIserror(true);
                    resolve()

                })
        } else {
            setErrorMessages(errorList);
            setIserror(true);
            resolve()
        }
    };

    const handleRowAdd = (newData, resolve) => {
        let errorList = validateData(newData);
        if (errorList.length === 0) {
            shareProvider.create(newData)
                .then(res => {
                    loadData();
                    resolve();
                    setErrorMessages([]);
                    setIserror(false)
                })
                .catch(error => {
                    setErrorMessages(["Ошибка создания новой транзакции!"]);
                    setIserror(true);
                    resolve()
                })
        } else {
            setErrorMessages(errorList);
            setIserror(true);
            resolve()
        }
    };

    const handleRowDelete = (oldData, resolve) => {
        shareProvider.delete(oldData)
            .then(res => {
                loadData();
                resolve()
            })
            .catch(error => {
                setErrorMessages(["Не удалось удалить транзакцию"]);
                setIserror(true);
                resolve()
            })
    };

    return (
        <div className="App">
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <div>
                        <CanvasJSChart options={chart}/>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div>
                        {iserror &&
                        <Alert severity="error">
                            {errorMessages.map((msg, i) => {
                                return <div key={i}>{msg}</div>
                            })}
                        </Alert>
                        }
                    </div>
                    <MaterialTable
                        title="Цены на акции"
                        columns={columns}
                        data={data}
                        icons={tableIcons}
                        localization={{
                            body: {
                                addTooltip: 'Добавить',
                                deleteTooltip: 'Удалить',
                                editTooltip: 'Изменить',
                                editRow: {
                                    deleteText: 'Вы действительно хотите удалить эту запись?',
                                    cancelTooltip: 'Нет',
                                    saveTooltip: 'Да'
                                }

                            },
                            header: {
                                actions: 'Действия'
                            },
                            pagination: {
                                labelDisplayedRows: '{from}-{to} из {count}',
                                labelRowsSelect: 'строк',
                                firstAriaLabel: 'К первой странице ',
                                firstTooltip: 'К первой странице',
                                previousAriaLabel: 'Предыдущая страница',
                                previousTooltip: 'Предыдущая страница',
                                nextAriaLabel: 'Следующая страница',
                                nextTooltip: 'Следующая страница',
                                lastAriaLabel: 'К последней странице',
                                lastTooltip: 'К последней странице'
                            },
                            toolbar: {
                                searchTooltip: 'Поиск',
                                searchPlaceholder: 'Поиск'
                            }
                        }}
                        editable={{
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    handleRowUpdate(newData, oldData, resolve);
                                }),
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    handleRowAdd(newData, resolve)
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    handleRowDelete(oldData, resolve)
                                }),
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );

}

export default App;
