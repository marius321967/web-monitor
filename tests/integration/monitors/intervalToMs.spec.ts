import { MonitorInterval } from "@/config/Config"
import intervalToMs from "@/monitors/IntervalToMs"
import { assert } from "chai"

describe('monitors/intervalToMs', () => {

  type Item = [ MonitorInterval, number ];

  const data: Item[] = [
    [ '30 seconds', 30_000 ],
    [ '2 minutes', 120_000 ],
    [ '7 hours', 25200_000 ],
    [ '3 days', 259200_000 ],
    [ '2 weeks', 1209600_000 ],
    [ '2 week', 1209600_000 ],
  ];

  data.forEach(([ input, expected ]) => 
    it(`Returns correct value (${input})`, () => assert.equal(intervalToMs(input), expected))
  )

})
