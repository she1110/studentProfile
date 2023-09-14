// import useThemeContext from '@theme/hooks/useThemeContext'
import {BaseTable, BaseTableProps} from 'ali-react-table';
import React from 'react';
import styled from 'styled-components';

const DarkSupportBaseTable: any = styled(BaseTable)`
  &.dark {
    --bgcolor: rgba(7, 17, 37, 1);
    --header-bgcolor: rgba(7, 17, 37, 1);
    --hover-bgcolor: #000066;
    --header-hover-bgcolor: #606164;
    --highlight-bgcolor: #3333ff;
    --header-highlight-bgcolor: #191a1b;
    --color: #dadde1;
    --header-color: #dadde1;
    --lock-shadow: rgb(37 37 37 / 0.5) 0 0 6px 2px;
    --border-color: #000099;
  }
`;

export const WebsiteBaseTable = React.forwardRef<BaseTable, BaseTableProps>(
  (props, ref) => {
    // const { isDarkTheme } = useThemeContext()

    return <DarkSupportBaseTable ref={ref} className={'dark'} {...props} />;
  },
);
