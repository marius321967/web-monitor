import { Recipient } from '@/config/Config'
import { base } from '@/notifications/sendNotification'
import { NotificationAgentMap } from '@/notifications/agents'
import { NotificationContext } from '@/notifications/sendNotification'
import sinon, { SinonSpy } from 'sinon'

describe('notifications/sendNotification', () => {

  let agentMap: NotificationAgentMap;
  let recipient: Recipient, context: NotificationContext;

  beforeEach(() => {
    agentMap = {
      email: sinon.fake.resolves(undefined)
    }
    
    recipient = { email: 'foo@bar.com' };
    context = {} as NotificationContext;
  })

  it('Notifies email', () => 
    base(agentMap)(recipient, context)
      .then(() => {
        sinon.assert.calledOnceWithExactly(agentMap.email as SinonSpy, 'foo@bar.com', context)
      })
  )

})
