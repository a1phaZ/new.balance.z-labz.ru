import React, {useState} from 'react';
import {Button, FormLayout, Group, Header, InfoRow, Input, Panel, PanelHeader, SimpleCell} from "@vkontakte/vkui";
import useApi from "../handlers/useApi";
import {format, startOfDay, endOfDay, startOfMonth, endOfMonth} from "date-fns";

/**
 * Получение временного периода
 * @param ts: Number - timestamp для получения периода
 * @param opt {{ts: Boolean, month: Boolean, day: Boolean}}
 * @returns {{end: Number | Date, begin: Number | Date}}
 */
const getDateRange = (ts, opt) => {
    const beginDay = !opt.ts ? startOfDay(new Date(ts)) : startOfDay(+new Date(ts));
    const endDay = !opt.ts ? endOfDay(new Date(ts)) : endOfDay(+new Date(ts));
    const beginMonth = !opt.ts ? startOfMonth(new Date(ts)) : startOfMonth(+new Date(ts));
    const endMonth = !opt.ts ? endOfMonth(new Date(ts)) : endOfMonth(+new Date(ts));

    if (opt.month) {
        return {
            begin: beginMonth,
            end: endMonth
        }
    }
    return {
        begin: beginDay,
        end: endDay
    }
}

const getUserAgentArray = (array, userAgent) => {
    return array?.map(item => {
        return item.sessionData.filter(item => {
            return (item.userAgent === userAgent);
        });
    }).flat();
}

export default ({id}) => {
    const [ts, setTs] = useState(() => {
        return format(new Date(), 'yyyy-MM-dd');
    });
    const [{response}, doApiFetch] = useApi('/user-session-data-ts');

    const dateRange = getDateRange(+new Date(ts), {ts: true, day: true, month: false});
    const newUsers = response && response.filter(user => +new Date(user.createdAt) > dateRange.begin && dateRange.end > +new Date(user.createdAt));
    const preparedData = response?.map(item => {
        const filter = item.sessionData.filter(item => {
            return (item.timeStamp > dateRange.begin && item.timeStamp < dateRange.end);
        });
        const newItem = item;
        newItem.sessionData = filter;
        return newItem;
    });

    const androidUsers = getUserAgentArray(preparedData, 'mobile_android');
    const iphoneUsers = getUserAgentArray(preparedData, 'mobile_iphone');
    const mobileWebUsers = getUserAgentArray(preparedData, 'mobile_web');
    const desktopUsers = getUserAgentArray(preparedData, 'desktop_web');
    const androidMessengerUsers = getUserAgentArray(preparedData, 'mobile_android_messenger');
    const iphoneMessengerUsers = getUserAgentArray(preparedData, 'mobile_iphone_messenger');

    return (
        <Panel id={id}>
            <PanelHeader>
                Статистика
            </PanelHeader>
            <FormLayout
                onSubmit={(e) => {
                    e.preventDefault();
                    doApiFetch({
                        method: 'GET',
                        params: {
                            ts: +new Date(ts)
                        }
                    })
                }}
            >
                <Input
                    type={'date'}
                    value={ts}
                    onChange={(e) => {
                        setTs(e.currentTarget.value);
                    }}
                />
                <Button>Получить данные</Button>
            </FormLayout>
            <Group>
                <Header mode={'secondary'}>
                    Статистика за {ts}
                </Header>
                <SimpleCell multiline>
                    <InfoRow header={'Новые пользователи за период'}>
                        {newUsers?.length}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header={'Пользователей за период'}>
                        {response?.length}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header={'Просмотров Android за период'}>
                        {androidUsers?.length}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header={'Просмотров Iphone за период'}>
                        {iphoneUsers?.length}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header={'Просмотров Desktop за период'}>
                        {desktopUsers?.length}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header={'Просмотров Mobile Web за период'}>
                        {mobileWebUsers?.length}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header={'Просмотров Android Messenger за период'}>
                        {androidMessengerUsers?.length}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header={'Просмотров Iphone Messenger за период'}>
                        {iphoneMessengerUsers?.length}
                    </InfoRow>
                </SimpleCell>

            </Group>
        </Panel>
    )
}