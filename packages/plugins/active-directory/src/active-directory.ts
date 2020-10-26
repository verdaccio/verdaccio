import { getForbidden, getInternalError, getUnauthorized } from '@verdaccio/commons-api';
import { Callback, IPluginAuth, Logger } from '@verdaccio/types';
import ActiveDirectory from 'activedirectory2';

export const NotAuthMessage = 'AD - Active Directory authentication failed';

export interface ActiveDirectoryConfig {
  url: string;
  baseDN: string;
  domainSuffix: string;
  groupName?: string | string[];
}

class ActiveDirectoryPlugin implements IPluginAuth<ActiveDirectoryConfig> {
  private config: ActiveDirectoryConfig;
  private logger: Logger;

  public constructor(config: ActiveDirectoryConfig, opts: { logger: Logger }) {
    this.config = config;
    this.logger = opts.logger;
  }

  public authenticate(user: string, password: string, cb: Callback): void {
    const username = `${user}@${this.config.domainSuffix}`;

    const connectionConfig = {
      ...this.config,
      domainSuffix: undefined,
      username,
      password,
    };

    const connection = new ActiveDirectory(connectionConfig);

    connection.authenticate(username, password, (err, isAuthenticated): void => {
      if (err) {
        this.logger.warn(`AD - Active Directory authentication failed with error: ${err}`);
        return cb(getInternalError(err));
      }

      if (!isAuthenticated) {
        this.logger.warn(NotAuthMessage);
        return cb(getUnauthorized(NotAuthMessage));
      }

      const { groupName } = this.config;
      if (!groupName) {
        this.logger.info('AD - Active Directory authentication succeeded');
        cb(null, [user]);
      } else {
        connection.getGroupMembershipForUser(username, (err, groups: object[]): void => {
          if (err) {
            this.logger.warn(`AD - Active Directory group check failed with error: ${err}`);
            return cb(getInternalError((err as unknown) as string));
          }

          const requestedGroups = Array.isArray(groupName) ? groupName : [groupName];
          const matchingGroups = requestedGroups.filter((requestedGroup): boolean =>
            groups.some(
              (group: { cn?: string; dn?: string }): boolean =>
                requestedGroup === group.cn || requestedGroup === group.dn
            )
          );

          if (matchingGroups.length <= 0) {
            const notMemberMessage = `AD - User ${user} is not 
            member of group(s): ${requestedGroups.join(', ')}`;

            this.logger.warn(notMemberMessage);
            cb(getForbidden(notMemberMessage));
          } else {
            this.logger.info(
              `AD - Active Directory authentication succeeded in group(s): ${matchingGroups.join(
                ', '
              )}`
            );
            cb(null, [...matchingGroups, user]);
          }
        });
      }
    });
  }
}

export default ActiveDirectoryPlugin;
