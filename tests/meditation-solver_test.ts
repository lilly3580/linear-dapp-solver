import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure linear-dapp-solver core functionality works",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const user = accounts.get('wallet_1')!;

    // Test meditation session recording
    let block = chain.mineBlock([
      Tx.contractCall('meditation-solver', 'record-meditation-session', 
        [
          types.uint(30),     // duration
          types.uint(1),       // meditation type
          types.none()         // optional notes
        ], 
        user.address
      )
    ]);

    // Verify session recorded successfully
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.type, 'ok');

    // Test group creation
    block = chain.mineBlock([
      Tx.contractCall('meditation-solver', 'create-meditation-group', 
        [
          types.utf8('Linear Dapp Group'),
          types.utf8('A group for linear thinkers')
        ], 
        user.address
      )
    ]);

    // Verify group created successfully
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.type, 'ok');
  }
});