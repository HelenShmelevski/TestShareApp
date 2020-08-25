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
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';

import {Line} from 'react-chartjs-2';

const api = axios.create({
    baseURL: `http://localhost:8080`
});

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

const COLORS = [
    'rgba(658, 118, 11, 1)',
    'rgba(12, 0, 358, 1)',
    'rgba(20, 92, 40, 1)',
    'rgba(20, 250, 68, 1)',
    'rgba(235, 115, 135, 1)',
    'rgba(92, 26, 20, 1)',
    'rgba(62, 46, 110, 1)',
    'rgba(230, 87, 222, 1)',
    'rgba(151, 87, 230, 1)',
    'rgba(185, 230, 87, 1)',
    'rgba(230, 189, 87, 1)',
    'rgba(87, 230, 192, 1)',
    'rgba(84, 153, 91, 1)',
    'rgba(118, 62, 163, 1)',
    'rgba(252, 68, 68, 1)',
    'rgba(54, 255, 195, 1)'
];


function App() {

    let columns = [
        {title: "id", field: "id", hidden: true},
        {title: "Дата", field: "date", placeholder: 'Введите дату в формате гггг-мм-дд'},
        {title: "Компания", field: "company", placeholder: 'Введите название компании' },
        {title: "Цена", field: "cost", placeholder: 'Введите сумму'}
    ];
    const [data, setData] = useState([]); //table data

//for error handling
    const [iserror, setIserror] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [chart, setChart] = useState({
        labels: [],
        datasets: []
    });

    const loadData = () => {
        api.get("/get")
            .then(res => {
                setData(res.data)
                const sortedData = res.data.sort((a, b) => new Date(a.date) - new Date(b.date))
                let group_data = {};
                let groupKey = [...new Set(res.data.map(o=>o.company))];
                res.data.forEach((row) => {
                    if ( group_data[row.company]) {
                        group_data[row.company].push(row);
                    } else {
                        group_data[row.company] = [row];
                    }
                });
                let datasets = []
                groupKey.forEach((company, index) => {
                    datasets.push({
                        label: company,
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(10,10,10,1)',
                        borderColor: COLORS[index],
                        borderWidth: 2,
                        // Данные по оси Y Цены
                        data: group_data[company].map(o=>o.cost)
                    });

                });
                setChart({labels: [...new Set(sortedData.map(o => o.date))], datasets: datasets})

            })
            .catch(error => {
            })
    }


    const validPeriod = (start, end, dateString) => {
        if (start <= dateString && dateString <= end) {
            return true;
        } else
            return false
    }

    const isValidDate = (dateString) => {
        let start = new Date("1556-01-01");
        let end = new Date();
        let regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        let toDate = new Date(dateString);
        if (!validPeriod(start,end,toDate)) return false;
        let dNum = toDate.getTime();
        if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return toDate.toISOString().slice(0,10) === dateString;
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleRowUpdate = (newData, oldData, resolve) => {
        //validation
        let errorList = [];
        if (newData.date === "" || !isValidDate(newData.date)) {
            errorList.push("Ошибка! Не верное значение даты. Попробуйте еще раз")
        }
        if (newData.company === "") {
            errorList.push("Ошибка! Отсутствует название компании. Попробуйте еще раз")
        }
        if (newData.cost === "" || isNaN(newData.cost) || newData.cost <= 0) {
            errorList.push("Ошибка! Не верное значение цены. Попробуйте еще раз")
        }

        if (errorList.length < 1) {
            api.patch("/update/" + newData.id, newData)
                .then(res => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
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
        //validation
        let errorList = [];
        if (newData.date === undefined || !isValidDate(newData.date)) {
            errorList.push("Ошибка! Не верное значение даты. Попробуйте еще раз")
        }
        if (newData.company === undefined) {
            errorList.push("Ошибка! Отсутствует название компании. Попробуйте еще раз")
        }
        if (newData.cost === undefined  || isNaN(newData.cost) || newData.cost <= 0) {
            errorList.push("Ошибка! Не верное значение цены. Попробуйте еще раз")
        }

        if (errorList.length < 1) { //no error
            api.post("/create", newData)
                .then(res => {
                    let dataToAdd = [...data];
                    dataToAdd.push(newData);
                    setData(dataToAdd);
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

        console.log(oldData);
        api.delete("/delete/" + oldData.id)
            .then(res => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
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
                        {chart.datasets.length !== 0 &&
                            <Line
                                data={chart}
                                options={{
                                    title:{
                                        display:true,
                                        text:'График зависимости цен на акции от даты транзакции',
                                        fontSize:20
                                    },
                                    legend:{
                                        display:true,
                                        position:'right'
                                    }
                                }}
                            />
                        }
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
