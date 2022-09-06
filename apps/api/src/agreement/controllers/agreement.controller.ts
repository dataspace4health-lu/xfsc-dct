import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiProduces, ApiResponse } from '@nestjs/swagger';
import { DataAssetPresentation } from '../dtos/data-asset.dto';
import { ValidateLogTokenDto } from '../dtos/validate-log-token.dto';
import { AgreementService } from '../services/agreement.service';
import { LogTokenService } from '../services/log-token.service';
import { UtilsService } from '../services/utils.service';

@Controller()
@ApiResponse({
  status: 400,
  description:
    `Bad request – missing or malformed request body (see also 415); response
    must contain a textual representation of the precise error`,
})
@ApiResponse({
  status: 401,
  description:
    `Unauthorized – invalid Data Provider signature or invalid Data Consumer signature`,
})
@ApiResponse({
  status: 403,
  description:
    `Forbidden – the requesting Participant is not a human being (this restriction
      might be removed in future versions)`,
})
@ApiResponse({
  status: 404,
  description:
    `Not found – Data Provider DID could not be resolved`,
})
@ApiResponse({
  status: 413,
  description:
    `Payload too large`,
})
@ApiResponse({
  status: 451,
  description:
    `Unavailable for legal reasons – Data Provider’s Gaia-X Participant status has
    been revoked`,
})
@ApiResponse({
  status: 415,
  description:
    `Unsupported media type`,
})
@ApiResponse({
  status: 424,
  description:
    `Failed dependency – could not validate Data Asset Self-Description model `,
})
@ApiResponse({
  status: 429,
  description:
    `Too many requests`,
})
export class AgreementController {
  constructor(
    private readonly agreementService: AgreementService,
   
    
  ) { }

  @ApiOperation({
    summary: `The GX-DCS MUST offer the communication interface for Data
    Asset Registration described below.`,
    description:
      `Register contract API
      <br/> - verify that users are GX Participants before allowing them to register a Data Asset.
      <br/> - check the properties named gax:negotiable to true in each Rule that contains a placeholder.
      <br/> - check with the GX-FC if the Self-Description is formally correct.`,
  })
  @ApiResponse({
    status: 200,
    description: `Error-checked, and validated Data Asset Self-Description (as
      JSON-LD) signed by GX-DCS.`,
  })

  @ApiBody({
    description: `Data Asset Self-Description as JSON-LD. The versioned Data Asset SD model is provided by GX-FC,
    where it can be freely downloaded [Ref-2]. The Data Asset Self-Description must be signed by the
    Data Provider beforehand, by adding the signature as a Proof`
  })
  @ApiConsumes('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @ApiProduces('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @Post('/register')
  async register(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.register(dataAsset);
  }

  @ApiOperation({
    summary: `Endpoint for directly making finalized Agreements based on an available Data Asset
    Self-Description. On success, it returns a finalized Agreement (i.e., a mutually signed Data Contract).`,
  })
  @ApiResponse({
    status: 200,
    description: `Finalized Agreement (i.e., mutually signed data contract), which is also forwarded to the Data Provider if this request succeeds. This finalized Agreement, then, can
    be sent to the “/log/token” endpoint to retrieve a Log Token which authenticates access
    at GX-DELS.`,
  })
  @ApiBody({
    description: `Agreement (Data Asset Self-Description with Consumer details added and placeholders filled)
    signed by the Data Consumer.`
  })
  @ApiConsumes('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @ApiProduces('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @Post('/make/contract')
  async makeContract(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.makeContract(dataAsset);
  }

  @ApiOperation({
    summary: `Endpoint for starting a contract negotiation. On success, it returns a confirmation
    that the Data Contract was valid and forwarded to the Data Provider.`,
  })
  @ApiResponse({
    status: 200,
    description: `Accepted – indicates that the Agreement has been forwarded to the Data Provider for confirmation`,
  })
  @ApiResponse({
    status: 426,
    description:
      `Upgrade required – Data Asset SD model is no longer supported`,
  })
  @ApiBody({
    description: `Agreement (Data Asset Self-Description with Consumer details added and placeholders filled)
    signed by the Data Consumer`
  })
  @ApiConsumes('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @ApiProduces('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @Post('/negotiate')
  async negotiate(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.negotiate(dataAsset);
  }

  @ApiOperation({
    summary: `Endpoint for finalizing a contract negotiation. On success, it finalizes the Agreement,
    signs it, returns it to the Data Provider and sends it to the Data Consumer.`,
  })
  @ApiResponse({
    status: 200,
    description: `Finalized Agreement (Now also signed by the GX-DCS), which is also forwarded to the Data Consumer if this request succeeds. This finalized Agreement,
    then, can be sent to the “/log/token” endpoint to retrieve a Log Token which authenticates access at GX-DELS.`,
  })
  @ApiResponse({
    status: 426,
    description:
      `Upgrade required – Data Asset SD model is no longer supported`,
  })
  @ApiBody({
    description: `Agreement (Signed by the Data Consumer and Data Provider)`
  })
  @ApiConsumes('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @ApiProduces('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @Post('/finalize')
  async finalize(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.finalize(dataAsset);
  }

  @ApiOperation({
    summary: `Endpoint for validation of a provided finalized Agreement. The GX-DCS evaluates
    the finalized Agreement and returns whether a finalized Agreement is valid or not, including a humanreadable explanation.`,
  })
  @ApiResponse({
    status: 200,
    description: `OK – Finalized Agreement is valid`,
  })
  @ApiResponse({
    status: 401,
    description:
      `Unauthorized – invalid Data Provider signature, invalid Data Consumer signature, or invalid GX-DCS signature`,
  })
  @ApiBody({
    description: `Finalized Agreement (i.e., mutually signed data contract)`
  })
  @ApiConsumes('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @ApiProduces('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @Post('/validate')
  @HttpCode(200)
  async validate(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.validate(dataAsset);
  }

  @ApiOperation({
    summary: `Endpoint for getting a Log Token. The prerequisite for that is a valid finalized Agreement which contains optional or mandatory logging. It returns a Log Token if the submitted finalized
    Agreement is valid.`,
  })
  @ApiResponse({
    status: 200,
    description: `Signed Log Token`,
  })
  @ApiResponse({
    status: 401,
    description:
      `Unauthorized – invalid Data Provider signature, invalid Data Consumer signature, or invalid GX-DCS signature`,
  })
  @ApiBody({
    description: `Finalized Agreement (i.e., mutually signed data contract)`
  })
  @ApiConsumes('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @ApiProduces('application/ld+json', 'application/n-quads', 'application/n-triples', 'application/trig', 'text/n3', 'text/turtle')
  @Post('/log/token')
  async logToken(@Body() dataAsset: DataAssetPresentation):Promise<string> {
    return this.agreementService.logToken(dataAsset);
  }




}
